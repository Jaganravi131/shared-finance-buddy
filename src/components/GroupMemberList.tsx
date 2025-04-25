
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useExpenseContext } from "@/context/ExpenseContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserPlus } from "lucide-react";
import { toast } from "sonner";

const GroupMemberList: React.FC = () => {
  const { currentGroup, users, addUser, addMemberToGroup } = useExpenseContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  
  const members = currentGroup?.members || [];
  
  // Generate a random avatar for new members
  const generateAvatar = (name: string) => {
    const seed = name.toLowerCase().replace(/\s+/g, '');
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };
  
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentGroup) {
      toast.error("No active group selected");
      return;
    }
    
    // Check if user with this email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === newMemberEmail.toLowerCase());
    
    if (existingUser) {
      // If user exists, add them to the current group
      addMemberToGroup(currentGroup.id, existingUser);
    } else {
      // Create a new user and add them to the current group
      const newUser = {
        name: newMemberName,
        email: newMemberEmail,
        avatar: generateAvatar(newMemberName),
        preferences: {
          notificationsEnabled: true,
          paymentReminders: true,
          theme: 'system' as const
        }
      };
      
      // Add the user to the users list
      addUser(newUser);
      
      // Find the newly added user in the updated users list
      setTimeout(() => {
        const addedUser = users.find(u => u.email.toLowerCase() === newMemberEmail.toLowerCase());
        if (addedUser && currentGroup) {
          addMemberToGroup(currentGroup.id, addedUser);
        }
      }, 0);
    }
    
    // Reset form and close dialog
    setNewMemberName("");
    setNewMemberEmail("");
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Group Members</CardTitle>
          <CardDescription>
            {currentGroup?.name} • {members.length} members
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Member</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <DialogDescription>
                Add a new member to {currentGroup?.name}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddMember} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  If this email already exists, we'll add that user to the group.
                </p>
              </div>
              
              <Button type="submit" className="w-full">
                Add to Group
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
              {member.id === currentGroup?.members[0].id && (
                <Badge variant="outline">Admin</Badge>
              )}
            </div>
          ))}
          
          {members.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No members in this group yet.</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsDialogOpen(true)}>
                Add Members
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupMemberList;
