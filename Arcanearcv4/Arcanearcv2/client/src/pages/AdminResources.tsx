import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Library, Plus, ExternalLink } from "lucide-react";
import { Resource } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminResources() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Self-Discipline",
    type: "article",
    url: "",
  });

  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/admin/resources"],
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/resources", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/resources"] });
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      toast({
        title: "Resource added!",
        description: "The new resource is now available in the learning hub.",
      });
      setFormData({
        title: "",
        description: "",
        category: "Self-Discipline",
        type: "article",
        url: "",
      });
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create resource",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-resources-title">
            Resource Library
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage learning resources for program members
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="hover-elevate active-elevate-2"
          data-testid="button-create-resource"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>New Resource</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Resource title"
                  required
                  className="h-12"
                  data-testid="input-resource-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the resource..."
                  required
                  className="min-h-24"
                  data-testid="input-resource-description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="category" className="h-12" data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Self-Discipline">Self-Discipline</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger id="type" className="h-12" data-testid="select-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  required
                  className="h-12"
                  data-testid="input-resource-url"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 hover-elevate active-elevate-2"
                  disabled={createMutation.isPending}
                  data-testid="button-submit-resource"
                >
                  {createMutation.isPending ? "Adding..." : "Add Resource"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="hover-elevate active-elevate-2"
                  data-testid="button-cancel-resource"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Resources List */}
      <div className="space-y-4">
        {resources && resources.length > 0 ? (
          resources.map((resource) => (
            <Card key={resource.id} className="hover-elevate transition-all shadow-md" data-testid={`card-resource-${resource.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {resource.category}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                        {resource.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                    <p className="text-muted-foreground mb-3">{resource.description}</p>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      {resource.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <Library className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Library className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No resources yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
