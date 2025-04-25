
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Define types for our data models
export type ExpenseSplit = {
  userId: string;
  amount: number;
  isPaid: boolean;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  date: Date;
  paidBy: string;
  category: string;
  groupId: string;
  splits: ExpenseSplit[];
};

export type Group = {
  id: string;
  name: string;
  members: User[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Balance = {
  userId: string;
  amount: number;
};

type ExpenseContextType = {
  expenses: Expense[];
  groups: Group[];
  users: User[];
  balances: Record<string, number>;
  currentUser: User | null;
  currentGroup: Group | null;
  setCurrentGroup: (group: Group) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  addGroup: (group: Omit<Group, "id">) => void;
  calculateBalances: () => Record<string, number>;
  addUser: (user: Omit<User, "id">) => void;
  settleUp: (fromUserId: string, toUserId: string, amount: number) => void;
  markExpenseAsPaid: (expenseId: string, userId: string) => void;
  loading: boolean;
};

// Create initial mock data
const mockUsers: User[] = [
  {
    id: "u1",
    name: "You",
    email: "you@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  },
  {
    id: "u2",
    name: "Alex",
    email: "alex@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    id: "u3",
    name: "Taylor",
    email: "taylor@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
  },
  {
    id: "u4",
    name: "Jordan",
    email: "jordan@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
  },
];

const mockGroups: Group[] = [
  {
    id: "g1",
    name: "Apartment 2024",
    members: mockUsers,
  },
  {
    id: "g2",
    name: "Summer Trip",
    members: [mockUsers[0], mockUsers[1], mockUsers[3]],
  },
];

const mockExpenses: Expense[] = [
  {
    id: "e1",
    title: "Grocery Shopping",
    amount: 120.50,
    date: new Date(2024, 3, 22),
    paidBy: "u1",
    category: "Food",
    groupId: "g1",
    splits: [
      { userId: "u1", amount: 30.13, isPaid: true },
      { userId: "u2", amount: 30.13, isPaid: false },
      { userId: "u3", amount: 30.12, isPaid: false },
      { userId: "u4", amount: 30.12, isPaid: false },
    ],
  },
  {
    id: "e2",
    title: "Internet Bill",
    amount: 89.99,
    date: new Date(2024, 3, 20),
    paidBy: "u3",
    category: "Utilities",
    groupId: "g1",
    splits: [
      { userId: "u1", amount: 22.50, isPaid: false },
      { userId: "u2", amount: 22.50, isPaid: false },
      { userId: "u3", amount: 22.49, isPaid: true },
      { userId: "u4", amount: 22.50, isPaid: false },
    ],
  },
  {
    id: "e3",
    title: "Hotel Reservation",
    amount: 450.00,
    date: new Date(2024, 3, 15),
    paidBy: "u4",
    category: "Travel",
    groupId: "g2",
    splits: [
      { userId: "u1", amount: 150.00, isPaid: false },
      { userId: "u4", amount: 150.00, isPaid: true },
      { userId: "u2", amount: 150.00, isPaid: false },
    ],
  },
  {
    id: "e4",
    title: "Dinner",
    amount: 78.40,
    date: new Date(2024, 3, 24),
    paidBy: "u2",
    category: "Food",
    groupId: "g1",
    splits: [
      { userId: "u1", amount: 19.60, isPaid: false },
      { userId: "u2", amount: 19.60, isPaid: true },
      { userId: "u3", amount: 19.60, isPaid: false },
      { userId: "u4", amount: 19.60, isPaid: false },
    ],
  },
];

// Create a local storage key for the app
const STORAGE_KEY = 'expenseease_data';

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Load data from local storage on initial render
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const storedData = localStorage.getItem(STORAGE_KEY);
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          
          // Convert string dates back to Date objects
          const processedExpenses = parsedData.expenses.map((expense: any) => ({
            ...expense,
            date: new Date(expense.date),
          }));
          
          setExpenses(processedExpenses);
          setGroups(parsedData.groups);
          setUsers(parsedData.users);
          setCurrentUser(parsedData.users[0]); // Default to the first user as "You"
          setCurrentGroup(parsedData.groups[0]);
        } else {
          // Use mock data for first-time users
          setExpenses(mockExpenses);
          setGroups(mockGroups);
          setUsers(mockUsers);
          setCurrentUser(mockUsers[0]);
          setCurrentGroup(mockGroups[0]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data. Using default data instead.");
        
        // Fallback to mock data
        setExpenses(mockExpenses);
        setGroups(mockGroups);
        setUsers(mockUsers);
        setCurrentUser(mockUsers[0]);
        setCurrentGroup(mockGroups[0]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save data to local storage whenever expenses, groups, or users change
  useEffect(() => {
    if (!loading) {
      const dataToSave = {
        expenses,
        groups,
        users
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [expenses, groups, users, loading]);

  // Calculate balances whenever expenses change
  useEffect(() => {
    setBalances(calculateBalances());
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: `e${Date.now().toString()}`,
    };
    setExpenses(prev => [...prev, newExpense]);
    toast.success("Expense added successfully");
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter((expense) => expense.id !== id));
    toast.success("Expense deleted successfully");
  };

  const addGroup = (group: Omit<Group, "id">) => {
    const newGroup = {
      ...group,
      id: `g${Date.now().toString()}`,
    };
    setGroups(prev => [...prev, newGroup]);
    setCurrentGroup(newGroup);
    toast.success(`Group "${newGroup.name}" created successfully`);
  };

  const addUser = (user: Omit<User, "id">) => {
    const newUser = {
      ...user,
      id: `u${Date.now().toString()}`,
    };
    setUsers(prev => [...prev, newUser]);
    toast.success(`User "${newUser.name}" added successfully`);
  };

  const calculateBalances = () => {
    const userBalances: Record<string, number> = {};
    
    // Initialize balances for all users
    users.forEach(user => {
      userBalances[user.id] = 0;
    });
    
    expenses.forEach(expense => {
      // Add the full amount to the person who paid
      userBalances[expense.paidBy] += expense.amount;
      
      // Subtract each person's share
      expense.splits.forEach(split => {
        userBalances[split.userId] -= split.isPaid ? 0 : split.amount;
      });
    });
    
    return userBalances;
  };

  // Mark an expense as paid for a specific user
  const markExpenseAsPaid = (expenseId: string, userId: string) => {
    setExpenses(prev => prev.map(expense => {
      if (expense.id === expenseId) {
        return {
          ...expense,
          splits: expense.splits.map(split => 
            split.userId === userId ? { ...split, isPaid: true } : split
          )
        };
      }
      return expense;
    }));
    toast.success("Payment marked as completed");
  };

  // Create a direct settlement between users
  const settleUp = (fromUserId: string, toUserId: string, amount: number) => {
    const settlementExpense = {
      id: `e${Date.now().toString()}`,
      title: "Settlement Payment",
      amount: amount,
      date: new Date(),
      paidBy: fromUserId,
      category: "Settlement",
      groupId: currentGroup?.id || "",
      splits: [
        { userId: fromUserId, amount: amount, isPaid: true },
        { userId: toUserId, amount: 0, isPaid: true },
      ]
    };
    
    setExpenses(prev => [...prev, settlementExpense]);
    toast.success(`Settlement of $${amount.toFixed(2)} completed`);
  };

  const value = {
    expenses,
    groups,
    users,
    balances,
    currentUser,
    currentGroup,
    setCurrentGroup,
    addExpense,
    deleteExpense,
    addGroup,
    addUser,
    calculateBalances,
    markExpenseAsPaid,
    settleUp,
    loading
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenseContext must be used within an ExpenseProvider");
  }
  return context;
};
