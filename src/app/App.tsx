import { useState, useEffect } from "react";
import { Moon, Sun, QrCode, Download } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [qrData, setQrData] = useState("HelloWorld");
  const [qrSize, setQrSize] = useState(200);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // Apply theme class to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const generateQRCode = () => {
    if (qrData.trim()) {
      const url = `https://api.apgy.in/qr/?data=${encodeURIComponent(qrData)}&size=${qrSize}`;
      setQrUrl(url);
    }
  };

  const downloadQRCode = async () => {
    if (qrUrl) {
      try {
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `qrcode-${qrData.substring(0, 20)}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error("Failed to download QR code:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header with theme toggle */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
          <div className="flex items-center gap-2">
            <QrCode className="size-6" />
            <h1>Scanify</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="size-5" />
            ) : (
              <Sun className="size-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Scanify</CardTitle>
              <CardDescription>
                Enter your data and customize the size
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="qr-data">Data to Encode</Label>
                <Input
                  id="qr-data"
                  type="text"
                  placeholder="Enter text, URL, or any data"
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      generateQRCode();
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qr-size">Size (px)</Label>
                <Input
                  id="qr-size"
                  type="number"
                  min="100"
                  max="1000"
                  value={qrSize}
                  onChange={(e) => setQrSize(parseInt(e.target.value) || 200)}
                />
              </div>

              <Button onClick={generateQRCode} className="w-full">
                <QrCode className="size-4 mr-2" />
                Generate QR Code
              </Button>
            </CardContent>
          </Card>

          {/* QR Code Display Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your QR Code</CardTitle>
              <CardDescription>
                {qrUrl
                  ? "Click download to save the QR code"
                  : "Generate a QR code to see it here"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {qrUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center bg-muted rounded-lg p-6">
                    <img
                      src={qrUrl}
                      alt="Generated QR Code"
                      className="max-w-full h-auto"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <Button
                    onClick={downloadQRCode}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="size-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center bg-muted rounded-lg p-12 min-h-[280px]">
                  <div className="text-center text-muted-foreground">
                    <QrCode className="size-16 mx-auto mb-4 opacity-50" />
                    <p>No QR code generated yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>
                  Enter any text, URL, or data you want to encode in the "Data to Encode" field
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>
                  Adjust the size of the QR code (100-1000 pixels)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>
                  Click "Generate QR Code" or press Enter to create your QR code
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>
                  Download the generated QR code as a PNG image
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>
                  Toggle between light and dark mode using the button in the header
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
