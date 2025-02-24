
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LoginCredentials } from "@/lib/types";
import { loginWithLDAP } from "@/lib/api";

export const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
    costCenter: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir si el usuario ya está autenticado
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginWithLDAP(credentials);
      
      if (response.success && response.user) {
        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(response.user));
        
        toast({
          title: "Benvingut/da",
          description: `Has iniciat sessió com a ${response.user.fullName}`,
        });

        // Navigate to home page
        window.location.href = "/";
      } else {
        throw new Error(response.error || 'Error en la autenticación');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: "Error d'autenticació",
        description: error instanceof Error ? error.message : "Hi ha hagut un error durant l'inici de sessió",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/70d83c98-5a0d-49cd-854d-2029b792990b.png" 
            alt="Fundació Puigvert" 
            className="mx-auto h-16"
          />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Sol·licitud de Material d'Oficina
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuari
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contrasenya
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="costCenter" className="block text-sm font-medium text-gray-700">
                Centre de Cost
              </label>
              <Input
                id="costCenter"
                name="costCenter"
                type="text"
                required
                value={credentials.costCenter}
                onChange={(e) => setCredentials(prev => ({ ...prev, costCenter: e.target.value }))}
                className="mt-1"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Autenticant..." : "Iniciar Sessió"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
