import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import InputErrorMessage from "../components/ui/InputErrorMessage";

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
          {...register("username", { required: true, minLength: 5 })}
        />
        {errors?.username && errors.username.type === "required" && (
          <InputErrorMessage msg="Username is required" />
        )}
        {errors?.username && errors.username.type === "minLength" && (
          <InputErrorMessage msg="Username should be at least 5 characters" />
        )}

        <Input
          placeholder="Email address"
          {...register("email", {
            required: true,
            pattern: /^[^@]+@[^@]+\.[^@.]{2,}$/,
          })}
        />
        {errors?.email && errors.email.type === "required" && (
          <InputErrorMessage msg="Email is required" />
        )}
        {errors?.email && errors.email.type === "pattern" && (
          <InputErrorMessage msg="Please enter a valid email address" />
        )}

        <Input
          placeholder="Password"
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        {errors?.password && errors.password.type === "required" && (
          <InputErrorMessage msg="Password is required" />
        )}

        {/* Submit Button */}
        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
