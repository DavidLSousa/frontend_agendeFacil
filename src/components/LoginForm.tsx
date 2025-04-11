import { submitLogin } from "../api/auth/login";
import { useNavigate } from "react-router-dom";

type Props = {
  onClose: () => void;
};

export default function LoginForm({ onClose }: Props) {
  const navigate = useNavigate();

  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      Email: formData.get("email") as string,
      Password: formData.get("password") as string,
    };

    try {
      await submitLogin(data);
      onClose();
      form.reset();
      navigate("/agenda");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmitLogin}>
      <input
        name="email"
        type="email"
        placeholder="E-mail"
        className="w-full px-4 py-2 border border-gray-300 rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Senha"
        className="w-full px-4 py-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
      >
        Entrar
      </button>
    </form>
  );
}
