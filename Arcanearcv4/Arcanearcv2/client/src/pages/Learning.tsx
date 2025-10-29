import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Library, ExternalLink, Video, FileText, Link2 } from "lucide-react";
import { Resource } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

const categoryColors: Record<string, string> = {
  "Self-Discipline": "bg-chart-1/10 text-chart-1",
  "Health": "bg-chart-2/10 text-chart-2",
  "Business": "bg-chart-3/10 text-chart-3",
  "Mindfulness": "bg-chart-4/10 text-chart-4",
};

const typeIcons = {
  video: Video,
  pdf: FileText,
  article: Link2,
};

export default function Learning() {
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const categories = ["Self-Discipline", "Health", "Business", "Mindfulness"];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-learning-title">
          Learning Hub
        </h1>
        <p className="text-lg text-muted-foreground">
          Curated resources to support your transformation journey
        </p>
      </div>

      {categories.map((category) => {
        const categoryResources = resources?.filter(r => r.category === category) || [];

        if (categoryResources.length === 0) return null;

        return (
          <div key={category}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Library className="h-6 w-6 text-primary" />
              {category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryResources.map((resource) => {
                const TypeIcon = typeIcons[resource.type as keyof typeof typeIcons] || Link2;

                return (
                  <Card key={resource.id} className="hover-elevate transition-all shadow-md" data-testid={`card-resource-${resource.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{resource.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={categoryColors[category] || "bg-muted"}>
                              {category}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              <TypeIcon className="h-3 w-3 mr-1" />
                              {resource.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{resource.description}</p>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full hover-elevate active-elevate-2" data-testid={`button-resource-${resource.id}`}>
                          Access Resource
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {resources?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Library className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No resources available yet. Check back soon!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
