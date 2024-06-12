function goToOriginalPage() {
    window.location.href = "index.html"; // Reemplaza "pagina_original.html" con la URL de tu página original
}

// guardar en el local storage
function saveLocalStorage(){
    nombre = document.getElementById('company-name').value;
    servicio = document.getElementById('service').value;
    tipoPersona = document.getElementById('type-person').value;
    cantidad = document.getElementById('quantity').value;
    nombreEquipo = document.getElementById('equipment-name').value;
    formaPago = document.getElementById('payment-method').value;

    const quoteData = {
        nombre,
        servicio,
        tipoPersona,
        cantidad,
        nombreEquipo,
        formaPago
    }

    let jsonString = JSON.stringify(quoteData);

    localStorage.setItem("quoteData", jsonString);

    alert('Datos enviados con exito')
}

async function generatePdf() {
    // Acceder al elemento del local storage
    const dataQuoteLs = JSON.parse(localStorage.getItem('quoteData'));
    console.log('Objeto del local storage', dataQuoteLs);

    // Crea el documento PDF
    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage([600, 700]);

    // Obtiene el ancho y alto de la página
    const { width, height } = page.getSize();
    const fontSize = 12;

    // Agrega el nombre "Scala metrology solution" en la esquina superior derecha en rojo
    const redColor = PDFLib.rgb(1, 0, 0);
    page.drawText("Scala metrology solution", { x: width - 200, y: height - 50, size: fontSize, color: redColor });

    // Agrega el NIT de la empresa y la fecha actual
    const date = new Date().toLocaleDateString();
    page.drawText(`NIT de la empresa: 993895805`, { x: 50, y: height - 100, size: fontSize });
    page.drawText(`Fecha: ${date}`, { x: 50, y: height - 120, size: fontSize });

    // Agrega el nombre de la persona
    page.drawText(`Nombre: ${dataQuoteLs.nombre}`, { x: 50, y: height - 150, size: fontSize });

    // Agrega una tabla con las columnas Descripcion, Precio
    const table = [
        ["Descripción", "Precio"],
        ["Producto 1", "10"],
        ["Producto 2", "20"],
        ["Producto 3", "30"]
    ];
    const tableHeight = 120;
    const tableWidth = 400;
    const startY = height - 200;
    const startX = 50;
    const cellMargin = 10;
    const cellHeight = 20;
    const cellWidth = (tableWidth - cellMargin * 2) / 2;

    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            const text = table[i][j];
            const x = startX + cellWidth * j + cellMargin;
            const y = startY - cellHeight * i - cellMargin;
            page.drawText(text, { x, y, size: fontSize });
        }
    }

    // Calcula el subtotal, iva y total
    const subtotal = 60;
    const iva = subtotal * 0.12;
    const total = subtotal + iva;

    // Agrega el subtotal, iva y total
    page.drawText(`Subtotal: ${subtotal}`, { x: 50, y: startY - tableHeight - 20, size: fontSize });
    page.drawText(`IVA: ${iva}`, { x: 50, y: startY - tableHeight - 40, size: fontSize });
    page.drawText(`Total: ${total}`, { x: 50, y: startY - tableHeight - 60, size: fontSize });

    // Agrega el método de pago
    page.drawText("Método de pago:", { x: 50, y: startY - tableHeight - 100, size: fontSize });
    page.drawText("Cuenta: 800038443", { x: 50, y: startY - tableHeight - 120, size: fontSize });
    page.drawText("Tarjeta: 7484745837", { x: 50, y: startY - tableHeight - 140, size: fontSize });

    // Obtener el contenido del documento como un blob
    const pdfBytes = await pdfDoc.save();

    // Crear un objeto URL para el blob
    const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));

    // Abrir el PDF en una nueva ventana
    window.open(pdfUrl);
}




