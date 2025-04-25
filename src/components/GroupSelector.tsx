
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExpenseContext } from "@/context/ExpenseContext";

const GroupSelector: React.FC = () => {
  const { groups, currentGroup, setCurrentGroup } = useExpenseContext();

  const handleGroupChange = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setCurrentGroup(group);
    }
  };

  return (
    <div>
      <Select value={currentGroup?.id} onValueChange={handleGroupChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select group" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GroupSelector;
