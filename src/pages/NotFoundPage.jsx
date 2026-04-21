import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { AlertCircle } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-base-100 p-6">
      <Card className="max-w-md w-full text-center p-6">
        <CardContent className="flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-error" />
          <CardTitle className="text-3xl font-bold text-base-content">
            404 - Página Não Encontrada
          </CardTitle>
          <CardDescription className="text-base-content/70">
            A página que você está tentando acessar não existe ou foi removida.
          </CardDescription>
          <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
