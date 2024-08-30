import toastr from "toastr";

function Notify (message: string, type: string, title: string): any {
    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "slideDown",
        hideMethod: "fadeOut",
    };
    switch (type) {
        case "info":
            toastr.info(message, title);
            break;
        case "warning":
            toastr.warning(message, title);
            break;
        case "error":
            toastr.error(message, title);
            break;
        case "success":
            toastr.success(message, title);
            break;
        default:
            toastr.info(message, title);
            break;
    }


}

export default Notify;