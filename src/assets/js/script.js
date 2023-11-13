$(document).ready(function () {
    $(".card").draggable({ containment: "#cards-container", cursor: "dragging" });
    $("#modal-mobilemayhaveissues button").on("click", () => {
        $("#modal-mobilemayhaveissues").hide();
    });

    $(".modal-backdrop").on("click", () => {
        $(".modal-root").fadeOut();
    });

    $(".job.see-more").on("click", () => {
        $(".jobs-details").fadeIn();
    });

    $(".formation.see-more").on("click", () => {
        $(".formations-details").fadeIn();
    });

    new QRCode(
        "qrcode", {
        text: document.location.href,
        width: 80,
        height: 80,
        colorDark: "#000000",
        colorLight: "#FFFFFF",
        correctLevel: QRCode.CorrectLevel.M
    }
    );

    $("#savetopdf").on("click", () => {
        $("#card-footer").hide();
        $("#card-qr").css("display", "flex");
        $(".see-more").css("display", "none");
        $(".see-more-online").css("display", "flex");
        const quality = 2.5; // Higher the better but larger file
        html2canvas(document.querySelector('#cv'),
            { scale: quality }
        ).then(canvas => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
            pdf.save("cv_hugo_chretien.pdf");
            $("#card-footer").show();
            $("#card-qr").hide();
            $(".see-more").css("display", "flex");
            $(".see-more-online").css("display", "none");
        });
    });
});