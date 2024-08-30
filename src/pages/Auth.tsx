import AuthForm from "../components/auth/AuthForm"
import "toastr/build/toastr.min.css";


const Auth = () => {
    return (
		<>
			<script src="https://kit.fontawesome.com/64d58efce2.js"></script>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />

			<AuthForm />
		</>
    )
}

export default Auth