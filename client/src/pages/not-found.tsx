import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center" data-testid="page-not-found">
      <h1 className="font-heading text-5xl font-bold text-maroon mb-4">404</h1>
      <p className="text-lg text-foreground mb-2">Page Not Found</p>
      <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button className="bg-maroon text-cream-DEFAULT" data-testid="button-go-home">
          Go to Homepage
        </Button>
      </Link>
    </div>
  );
}
