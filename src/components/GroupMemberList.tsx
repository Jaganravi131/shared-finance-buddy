
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useExpenseContext } from "@/context/ExpenseContext";
import { Badge } from "@/components/ui/badge";

const GroupMemberList: React.FC = () => {
  const { currentGroup } = useExpenseContext();
  const members = currentGroup?.members || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Members</CardTitle>
        <CardDescription>
          {currentGroup?.name} • {members.length} members
        </CardDescription>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupMemberList;
