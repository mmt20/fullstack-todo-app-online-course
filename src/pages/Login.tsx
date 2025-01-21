import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { LOGIN_FORM } from "../data";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { loginSchema } from "../validation";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import axIosinstance from "../config/axios.config";

interface IFormInput {
  identifier: string;
  password: string;
}
const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(loginSchema) });

  // ** Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    //  1- Pending   => Loading
    setIsLoading(true);
    try {
      //  2- Fulfilled => SUCCESS => (OPTIONAL)
      const { status } = await axIosinstance.post("/auth/local", data);
      console.log(status);

      if (status === 200) {
        toast.success("You will navigate to Home page after 4 seconds !", {
          position: "bottom-center",
          duration: 4000,
          style: {
            backgroundColor: "black",
            color: "White",
            width: "fit-content",
          },
        });
      }
    } catch (error) {
      // **  3- Rejected  => Field   => (OPTIONAL)
      const errObj = error as AxiosError<IErrorResponse>;
      console.log(errObj.response?.data.error.message);
      console.log(error);
      toast.error(`${errObj.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ** Renders
  const renderLoginForm = LOGIN_FORM.map(
    ({ name, placeholder, type, validation }, idx) => {
      return (
        <div key={idx}>
          <Input
            type={type}
            placeholder={placeholder}
            {...register(name, validation)}
          />
          {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
        </div>
      );
    }
  );
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginForm}
        <Button isLoading={isLoading} fullWidth>
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
