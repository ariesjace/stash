import { Card, CardContent } from "@/components/ui/card";

export default function GridList02() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card
            className="relative border transition-all duration-100 hover:border-muted-foreground hover:shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 py-0"
          >
            <CardContent className="flex items-center space-x-4 p-4">
              <div className="min-w-0 flex-1">
                <a href="#" className="focus:outline-none">
                  <span aria-hidden="true" className="absolute inset-0" />
                  <p className="text-sm font-medium text-foreground">
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                  </p>
                </a>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
