ZOHO.embeddedApp.on("PageLoad", function(data) {
    ZOHO.CRM.API.getRecord({ Entity: "Leads", RecordID: data.EntityId })
        .then(function(response) {
            let inmueble = response.data[0]?.Valor_Inmueble;
            if (inmueble) {
                document.getElementById('valorInmueble').value = inmueble;
            }
        });
});

ZOHO.embeddedApp.init();

document.getElementById('calcular').addEventListener('click', function() {
    const valorInmueble = parseFloat(document.getElementById('valorInmueble').value);
    const cuotaInicial = parseFloat(document.getElementById('cuotaInicial').value);
    const tasaInteres = parseFloat(document.getElementById('tasaInteres').value) / 100;
    const plazo = parseInt(document.getElementById('plazo').value);

    if (isNaN(valorInmueble) || isNaN(cuotaInicial) || isNaN(tasaInteres) || isNaN(plazo)) {
        alert('⚠️ Completa todos los campos correctamente.');
        return;
    }

    const valorCredito = valorInmueble - (valorInmueble * (cuotaInicial / 100));
    const tasaMensual = tasaInteres / 12;
    const numCuotas = plazo * 12;
    const cuotaMensual = (valorCredito * tasaMensual) / (1 - Math.pow((1 + tasaMensual), -numCuotas));
    const totalPagado = cuotaMensual * numCuotas;

    document.getElementById('resultado').innerText = "📝 Detalle del Crédito Hipotecario:";
    document.getElementById('credito').innerText = formatCurrency(valorCredito);
    document.getElementById('cuota').innerText = formatCurrency(cuotaMensual);
    document.getElementById('totalPago').innerText = formatCurrency(totalPagado);

    generarTablaAmortizacion(valorCredito, cuotaMensual, tasaMensual, numCuotas);
});

function generarTablaAmortizacion(saldo, cuotaMensual, tasaMensual, numCuotas) {
    const tbody = document.querySelector("#tablaAmortizacion tbody");
    tbody.innerHTML = "";

    for (let i = 1; i <= numCuotas; i++) {
        let interes = saldo * tasaMensual;
        let capital = cuotaMensual - interes;
        saldo -= capital;

        const fila = `
            <tr>
                <td>${i}</td>
                <td>${formatCurrency(cuotaMensual)}</td>
                <td>${formatCurrency(interes)}</td>
                <td>${formatCurrency(capital)}</td>
                <td>${formatCurrency(Math.max(saldo, 0))}</td>
            </tr>
        `;

        tbody.innerHTML += fila;
    }
}

function formatCurrency(value) {
    return `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
