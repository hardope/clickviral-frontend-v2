import AuthForm from "../components/AuthForm"

const Auth = () => {
    return (
		<>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
			<script src="https://kit.fontawesome.com/64d58efce2.js"></script>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />

			<AuthForm />
		</>
    )
}

export default Auth