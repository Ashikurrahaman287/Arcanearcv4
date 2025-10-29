import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, Mail, Users as UsersIcon, Calendar, CheckCircle2, Circle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, Message } from "@shared/schema";

const messageSchema = z.object({
  recipientType: z.enum(["individual", "all", "week"]),
  recipientId: z.string().optional(),
  weekNumber: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(10, "Message must be at least 10 characters"),
}).refine((data) => {
  if (data.recipientType === "individual") {
    return !!data.recipientId;
  }
  if (data.recipientType === "week") {
    return !!data.weekNumber;
  }
  return true;
}, {
  message: "Please select a recipient",
  path: ["recipientId"],
});

type MessageFormData = z.infer<typeof messageSchema>;

interface MessageWithRecipient extends Message {
  recipient?: User;
}

export default function AdminMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [recipientType, setRecipientType] = useState<"individual" | "all" | "week">("all");

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      recipientType: "all",
      subject: "",
      content: "",
    },
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/admin/messages"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageFormData) => {
      let messageData: any = {
        subject: data.subject,
        content: data.content,
      };

      if (data.recipientType === "individual") {
        messageData.recipientId = data.recipientId;
        messageData.isGroupMessage = false;
      } else if (data.recipientType === "all") {
        messageData.isGroupMessage = true;
        messageData.groupFilter = JSON.stringify({ type: "all" });
      } else if (data.recipientType === "week") {
        messageData.isGroupMessage = true;
        messageData.groupFilter = JSON.stringify({ 
          type: "week", 
          weekNumber: parseInt(data.weekNumber || "1") 
        });
      }

      return apiRequest("POST", "/api/admin/messages", messageData);
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
      form.reset({
        recipientType: "all",
        subject: "",
        content: "",
      });
      setRecipientType("all");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MessageFormData) => {
    sendMessageMutation.mutate(data);
  };

  const getRecipientInfo = (message: Message) => {
    if (message.isGroupMessage && message.groupFilter) {
      try {
        const filter = JSON.parse(message.groupFilter);
        if (filter.type === "all") {
          return "All Users";
        } else if (filter.type === "week") {
          return `Week ${filter.weekNumber} Users`;
        }
      } catch {
        return "Group Message";
      }
    }
    return message.recipientId || "Unknown";
  };

  if (usersLoading || messagesLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Messages</h1>
        <p className="text-lg text-muted-foreground">
          Send messages to users and view sent messages
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send New Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="recipientType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Type</FormLabel>
                    <Select
                      onValueChange={(value: "individual" | "all" | "week") => {
                        field.onChange(value);
                        setRecipientType(value);
                        form.setValue("recipientId", undefined);
                        form.setValue("weekNumber", undefined);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipient type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="individual">Individual User</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="week">By Week</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {recipientType === "individual" && (
                <FormField
                  control={form.control}
                  name="recipientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select User</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users?.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.fullName} (@{user.username})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {recipientType === "week" && (
                <FormField
                  control={form.control}
                  name="weekNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Week</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a week" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => (
                            <SelectItem key={week} value={week.toString()}>
                              Week {week}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter message subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your message (minimum 10 characters)"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={sendMessageMutation.isPending}>
                <Send className="h-4 w-4 mr-2" />
                {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Sent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages && messages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.subject}</TableCell>
                    <TableCell className="max-w-md truncate text-muted-foreground">
                      {message.content.substring(0, 100)}
                      {message.content.length > 100 && "..."}
                    </TableCell>
                    <TableCell>
                      {message.isGroupMessage ? (
                        <Badge variant="secondary" className="gap-1">
                          <UsersIcon className="h-3 w-3" />
                          {getRecipientInfo(message)}
                        </Badge>
                      ) : (
                        <span className="text-sm">
                          {users?.find(u => u.id === message.recipientId)?.fullName || "Unknown"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(message.sentAt).toLocaleDateString()} {new Date(message.sentAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {!message.isGroupMessage && (
                        message.readAt ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Read
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <Circle className="h-3 w-3" />
                            Unread
                          </Badge>
                        )
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No messages sent yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
