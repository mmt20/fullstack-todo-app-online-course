import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  console.log(errors);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Username"
          {...register("username", { required: "Username is required" })}
        />

        <Input
          placeholder="email address"
          {...register("email", { required: "Email is required" })}
        />
        <Input
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />

        <Button fullWidth>Register </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
