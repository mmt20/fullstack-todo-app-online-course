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
import { Link } from "react-router-dom";

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
      const { status, data: resData } = await axIosinstance.post(
        "/auth/local",
        data
      );
      console.log(resData);

      if (status === 200) {
        toast.success("You will navigate to Home page after 2 seconds !", {
          position: "bottom-center",
          duration: 2000,
          style: {
            backgroundColor: "black",
            color: "White",
            width: "fit-content",
          },
        });
        localStorage.setItem("loggedInUser", JSON.stringify(resData));
        setTimeout(() => {
          location.replace("/");
        }, 2000);
      }
    } catch (error) {
      // **  3- Rejected  => Field   => (OPTIONAL)
      const errObj = error as AxiosError<IErrorResponse>;
      console.log(errObj.response?.data.error.message);
      console.log(error);
      toast.error(`${errObj.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 2000,
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
      <p className="text-center mt-4 text-gray-600 text-sm">
        No account?
        <Link
          to="/register"
          className="ml-2 text-indigo-600 hover:text-indigo-500 underline  transition-colors duration-300"
          reloadDocument
        >
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
