$(window).on("load", function () {
    var selectAll = $('.slcChange')
    selectAll.each(function( index ) {
        slcCss($( this ))
      }); 

      function slcCss(select){
        switch (select.val()) {
          case "1":
            select.removeClass('w3-border-red w3-border-orange')
            break;
          case "2":
            select.removeClass('w3-border-blue w3-border-orange').addClass('text-success');
            break;
          case "3":
            select.removeClass('w3-border-red w3-border-blue').addClass('text-danger');
            break;
        }
      }


    $("table > tbody > tr input").change(function (event) {
        event.preventDefault()
        var tbl_row = $(this).closest('tr')
        tbl_row.addClass('fst-italic')
        tbl_row.find("td:nth-child(5)").addClass('fw-bolder')
        tbl_row.find(".change").html('true')
    });

    $('#btn-editar').click(function (event) {
        event.preventDefault();
        $('#btn-editar').addClass('d-none');
        $('#btn-cancelar').removeClass('d-none');
        $('#btn-guardar').removeClass('d-none');
        $('.slcChange').removeAttr('disabled');
    });

    $('#btn-cancelar').click(function (event) {
        event.preventDefault();
        $('#btn-editar').removeClass('d-none');
        $('#btn-cancelar').addClass('d-none');
        $('#btn-guardar').addClass('d-none');
        $('.slcChange').attr('disabled', true);
    });

    $('#btn-guardar').click(function (event) {
        event.preventDefault()
        let datosModificados = []
        $("table > tbody > tr").each(function () {
            var tbl_row = $(this)
            if (tbl_row.find(".change").html() === 'true') {
                let fila = {
                    escuelaOrigen: tbl_row.find("td:nth-child(4)").text().trim(),
                    documento: tbl_row.find("td:nth-child(6)").text().trim(),
                    escuelaDestino: tbl_row.find("td:nth-child(8) input").val().trim() || "",
                    traspasoRow: tbl_row.find("td:nth-child(10)").text().trim(),
                    estado: tbl_row.find("td:nth-child(11)").text().trim(),
                }
                datosModificados.push(fila);
            }
        })

        if (datosModificados.length === 0) {
            alert("No hay datos modificados para guardar.");
            return;
        } else{
            //alert("Datos modificados:\n" + JSON.stringify(datosModificados, null, 2))
        }

        $.ajax({
            url: '/traspaso/postArray',
            contentType: 'application/json',
            method: 'POST',
            data: JSON.stringify({ datosModificados }),
            dataType: 'text',
            beforeSend: showSpinner,
            success: function (response) {
                alert("Datos modificados:\n" + response,)
                location.reload();
                $('.slcChange').attr('disabled', true)
            },
            error: function (xhr, status, error) {
                console.error("Error al guardar:", error);
                alert("Error al guardar los datos: " + error);
            }
        });
    });

//     async function actualizarTabla(datosModificados) {
//         await datosModificados.forEach(modificado => {
//         // Busca la fila correspondiente según un identificador único, como documento o traspasoRow
//         $("table > tbody > tr").each(function () {
//             var tbl_row = $(this);
//             if (tbl_row.find("td:nth-child(6)").text().trim() === modificado.documento) {
//                 // Actualiza los valores necesarios
//                 tbl_row.find("td:nth-child(8) input").val(modificado.escuelaDestino)
//                 tbl_row.find("td:nth-child(9)").text("Pendiente") //estado
//                 tbl_row.find("td:nth-child(11)").text(1) //estado
//                 tbl_row.find(".change").html("false"); // Marca como no modificado
//                 tbl_row.removeClass('fst-italic');
//                 tbl_row.find("td:nth-child(5)").removeClass('fw-bolder');
//                 tbl_row.find(".change").html('false');
//                 tbl_row.find(".estudiante").removeClass('text-success');
//                 $('#btn-editar').removeClass('d-none');
//                 $('#btn-cancelar').addClass('d-none');
//                 $('#btn-guardar').addClass('d-none');
//             }
//         });
//     });
// }

    function showSpinner() {
        $('#loading-spinner').removeClass('d-none');
    }

    function hideSpinner() {
        $('#loading-spinner').addClass('d-none');
    }
});
