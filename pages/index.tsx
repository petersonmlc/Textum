
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RevisIA() {
  const [inputText, setInputText] = useState("");
  const [revisedText, setRevisedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRevise = async () => {
    setLoading(true);
    // Simulação de revisão com IA
    const simulatedResponse = inputText
      .replace(/\bvc\b/g, "você")
      .replace(/pq/g, "porque")
      .replace(/ n\b/g, " não");
    setTimeout(() => {
      setRevisedText(simulatedResponse);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Textum - MVP</h1>
      <Textarea
        placeholder="Cole aqui seu texto para revisão..."
        rows={8}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <Button onClick={handleRevise} disabled={loading}>
        {loading ? "Revisando..." : "Revisar Texto"}
      </Button>

      {revisedText && (
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Texto Revisado:</h2>
            <p>{revisedText}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
