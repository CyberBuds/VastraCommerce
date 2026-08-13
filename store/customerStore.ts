import { create } from 'zustand';
import { 
  Customer, 
  CustomerGroup, 
  CustomerSegment, 
  Address, 
  WalletTransaction, 
  RewardPointHistory, 
  WishlistItem, 
  CustomerReview, 
  SupportTicket, 
  CustomerNote, 
  ActivityLog,
  TicketMessage
} from '@/types/customer';

// Helper for localStorage syncing
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to sync CRM state to storage:', e);
  }
}

// ==========================================
// DEFAULT SEED DATA
// ==========================================

const DEFAULT_GROUPS: CustomerGroup[] = [];
const DEFAULT_SEGMENTS: CustomerSegment[] = [];
const DEFAULT_CUSTOMERS: Customer[] = [];

// ==========================================
// STORE ACTIONS & INTERFACE
// ==========================================

interface CustomerState {
  customers: Customer[];
  groups: CustomerGroup[];
  segments: CustomerSegment[];
  isLoading: boolean;
}

interface CustomerActions {
  // Customer CRUD
  addCustomer: (customer: Omit<Customer, 'id' | 'customerCode' | 'createdAt' | 'addresses' | 'walletTransactions' | 'rewardPointsHistory' | 'wishlist' | 'reviews' | 'tickets' | 'notes' | 'activityLogs'> & { addresses?: Address[] }) => Customer;
  updateCustomer: (id: string, updated: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Bulk operations
  bulkUpdateStatus: (ids: string[], status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED') => void;
  bulkDelete: (ids: string[]) => void;
  bulkAssignGroup: (ids: string[], groupId: string, groupName: string) => void;
  bulkAssignTags: (ids: string[], tags: string[]) => void;

  // Wallet
  adjustWalletBalance: (customerId: string, type: 'CREDIT' | 'DEBIT', amount: number, purpose: WalletTransaction['purpose'], notes?: string, approvedBy?: string) => void;
  
  // Reward Points
  adjustRewardPoints: (customerId: string, type: 'EARNED' | 'REDEEMED' | 'EXPIRED', points: number, reason: string, referenceId?: string) => void;
  
  // Wishlist
  moveToCart: (customerId: string, sku: string) => void;
  removeFromWishlist: (customerId: string, sku: string) => void;
  bulkDeleteWishlist: (customerId: string, skus: string[]) => void;
  addToWishlist: (customerId: string, item: WishlistItem) => void;

  // Reviews
  approveReview: (customerId: string, reviewId: string) => void;
  rejectReview: (customerId: string, reviewId: string) => void;
  deleteReview: (customerId: string, reviewId: string) => void;
  replyToReview: (customerId: string, reviewId: string, replyText: string) => void;

  // Support Tickets
  addTicket: (customerId: string, title: string, department: SupportTicket['department'], priority: SupportTicket['priority'], category: string, initialMessage: string, attachments?: string[]) => SupportTicket;
  addTicketMessage: (ticketId: string, sender: TicketMessage['sender'], senderName: string, content: string, attachments?: string[]) => void;
  assignTicketStaff: (ticketId: string, staffId: string, staffName: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  addTicketInternalNotes: (ticketId: string, notes: string) => void;

  // Notes
  addCustomerNote: (customerId: string, content: string, type: CustomerNote['type'], author: string) => void;
  togglePinNote: (customerId: string, noteId: string) => void;
  deleteCustomerNote: (customerId: string, noteId: string) => void;

  // Groups CRUD
  addGroup: (group: Omit<CustomerGroup, 'id' | 'createdAt'>) => void;
  updateGroup: (id: string, updated: Partial<CustomerGroup>) => void;
  deleteGroup: (id: string) => void;

  // Segments CRUD
  addSegment: (segment: Omit<CustomerSegment, 'id' | 'createdAt' | 'memberCount'>) => void;
  updateSegment: (id: string, updated: Partial<CustomerSegment>) => void;
  deleteSegment: (id: string) => void;
  recalculateSegmentMembers: () => void;
}

export const useCustomerStore = create<CustomerState & CustomerActions>((set, get) => ({
  customers: getFromStorage('ent_crm_customers', DEFAULT_CUSTOMERS),
  groups: getFromStorage('ent_crm_groups', DEFAULT_GROUPS),
  segments: getFromStorage('ent_crm_segments', DEFAULT_SEGMENTS),
  isLoading: false,

  // 1. ADD CUSTOMER
  addCustomer: (data) => {
    const customers = get().customers;
    const groups = get().groups;
    
    const targetGroup = groups.find(g => g.id === data.groupId);
    const grpName = targetGroup ? targetGroup.name : 'Retail Customers';

    const newCustomer: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      customerCode: `ENT-CUST-${1000 + customers.length + 1}`,
      groupName: grpName,
      createdAt: new Date().toISOString(),
      addresses: data.addresses || [],
      walletBalance: data.walletBalance || 0,
      walletTransactions: data.walletBalance ? [{
        id: `tx-init-${Date.now()}`,
        type: 'CREDIT',
        amount: data.walletBalance,
        purpose: 'DEPOSIT',
        notes: 'Initial account activation deposit',
        timestamp: new Date().toISOString(),
        approvedBy: 'CRM Officer'
      }] : [],
      rewardPoints: data.rewardPoints || 0,
      rewardPointsHistory: data.rewardPoints ? [{
        id: `rw-init-${Date.now()}`,
        type: 'EARNED',
        points: data.rewardPoints,
        reason: 'Initial account setup allocation',
        timestamp: new Date().toISOString()
      }] : [],
      wishlist: [],
      reviews: [],
      tickets: [],
      notes: [],
      activityLogs: [
        {
          id: `act-init-${Date.now()}`,
          action: 'REGISTRATION',
          title: 'Profile Provisioned',
          description: `Account created under ${grpName} group classification.`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    const updated = [...customers, newCustomer];
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
    return newCustomer;
  },

  // 2. UPDATE CUSTOMER
  updateCustomer: (id, updatedFields) => {
    const updated = get().customers.map(c => {
      if (c.id === id) {
        const withUpdates = { ...c, ...updatedFields };
        // Log update action if meaningful fields change
        if (updatedFields.status || updatedFields.groupId) {
          withUpdates.activityLogs = [
            {
              id: `act-upd-${Date.now()}`,
              action: 'PROFILE_UPDATE',
              title: 'Account Settings Modified',
              description: `Admin updated fields: ${updatedFields.status ? `Status: ${updatedFields.status}` : ''} ${updatedFields.groupId ? `Group Reassigned` : ''}`,
              timestamp: new Date().toISOString()
            },
            ...c.activityLogs
          ];
        }
        return withUpdates;
      }
      return c;
    });

    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  // 3. DELETE CUSTOMER
  deleteCustomer: (id) => {
    const updated = get().customers.filter(c => c.id !== id);
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  // 4. BULK OPERATIONS
  bulkUpdateStatus: (ids, status) => {
    const updated = get().customers.map(c => {
      if (ids.includes(c.id)) {
        return {
          ...c,
          status,
          activityLogs: [
            {
              id: `act-bulk-${Date.now()}`,
              action: 'PROFILE_UPDATE' as const,
              title: `Status Changed to ${status}`,
              description: `Bulk operation triggered status override.`,
              timestamp: new Date().toISOString()
            },
            ...c.activityLogs
          ]
        };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  bulkDelete: (ids) => {
    const updated = get().customers.filter(c => !ids.includes(c.id));
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  bulkAssignGroup: (ids, groupId, groupName) => {
    const updated = get().customers.map(c => {
      if (ids.includes(c.id)) {
        return {
          ...c,
          groupId,
          groupName,
          activityLogs: [
            {
              id: `act-grp-${Date.now()}`,
              action: 'PROFILE_UPDATE' as const,
              title: `Reassigned to Group: ${groupName}`,
              description: `Bulk assignment triggered group update.`,
              timestamp: new Date().toISOString()
            },
            ...c.activityLogs
          ]
        };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  bulkAssignTags: (ids, tags) => {
    const updated = get().customers.map(c => {
      if (ids.includes(c.id)) {
        // Merge without duplicates
        const mergedTags = Array.from(new Set([...c.tags, ...tags]));
        return { ...c, tags: mergedTags };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  // 5. ADJUST WALLET
  adjustWalletBalance: (customerId, type, amount, purpose, notes, approvedBy) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const delta = type === 'CREDIT' ? amount : -amount;
        const newBalance = Math.max(0, c.walletBalance + delta);
        
        const newTx: WalletTransaction = {
          id: `tx-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          type,
          amount,
          purpose,
          notes: notes || 'Financial audit correction',
          timestamp: new Date().toISOString(),
          approvedBy: approvedBy || 'System Administrator'
        };

        const newLog: ActivityLog = {
          id: `act-tx-${Date.now()}`,
          action: 'WALLET_ADJUSTMENT',
          title: `Wallet ${type === 'CREDIT' ? 'Credited' : 'Debited'}`,
          description: `Amount: ₹${amount.toLocaleString()} for ${purpose}. New Balance: ₹${newBalance.toLocaleString()}`,
          referenceId: newTx.id,
          timestamp: new Date().toISOString()
        };

        return {
          ...c,
          walletBalance: newBalance,
          walletTransactions: [newTx, ...c.walletTransactions],
          activityLogs: [newLog, ...c.activityLogs]
        };
      }
      return c;
    });

    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  // 6. ADJUST REWARD POINTS
  adjustRewardPoints: (customerId, type, points, reason, referenceId) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const delta = type === 'EARNED' ? points : -points;
        const newPoints = Math.max(0, c.rewardPoints + delta);

        const newHistory: RewardPointHistory = {
          id: `rw-hist-${Date.now()}`,
          type,
          points,
          reason,
          referenceId,
          expiryDate: type === 'EARNED' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined, // 1 year expiry
          timestamp: new Date().toISOString()
        };

        const newLog: ActivityLog = {
          id: `act-rw-${Date.now()}`,
          action: type === 'EARNED' ? 'REWARD_EARNED' : 'REWARD_REDEEMED',
          title: `Loyalty Points ${type}`,
          description: `${points} points for ${reason}. New Balance: ${newPoints}`,
          referenceId: newHistory.id,
          timestamp: new Date().toISOString()
        };

        return {
          ...c,
          rewardPoints: newPoints,
          rewardPointsHistory: [newHistory, ...c.rewardPointsHistory],
          activityLogs: [newLog, ...c.activityLogs]
        };
      }
      return c;
    });

    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    get().recalculateSegmentMembers();
  },

  // 7. WISHLIST ACTIONS
  moveToCart: (customerId, sku) => {
    // In our simplified mock, moving to cart just triggers a toast on client side and deletes from wishlist
    get().removeFromWishlist(customerId, sku);
  },

  removeFromWishlist: (customerId, sku) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const itemToRemove = c.wishlist.find(w => w.sku === sku);
        const filtered = c.wishlist.filter(w => w.sku !== sku);

        const newLogs = itemToRemove ? [
          {
            id: `act-wish-rm-${Date.now()}`,
            action: 'WISHLIST_REMOVE' as const,
            title: 'Removed from Wishlist',
            description: `${itemToRemove.productName} removed.`,
            timestamp: new Date().toISOString()
          },
          ...c.activityLogs
        ] : c.activityLogs;

        return {
          ...c,
          wishlist: filtered,
          activityLogs: newLogs
        };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  bulkDeleteWishlist: (customerId, skus) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const filtered = c.wishlist.filter(w => !skus.includes(w.sku));
        return { ...c, wishlist: filtered };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  addToWishlist: (customerId, item) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        // Avoid duplicate SKU
        if (c.wishlist.some(w => w.sku === item.sku)) return c;
        const added = [...c.wishlist, item];
        return {
          ...c,
          wishlist: added,
          activityLogs: [
            {
              id: `act-wish-add-${Date.now()}`,
              action: 'WISHLIST_ADD' as const,
              title: 'Added to Wishlist',
              description: `Marked item: ${item.productName}.`,
              timestamp: new Date().toISOString()
            },
            ...c.activityLogs
          ]
        };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  // 8. REVIEWS ACTIONS
  approveReview: (customerId, reviewId) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const updatedReviews = c.reviews.map(r => {
          if (r.id === reviewId) {
            return { ...r, status: 'APPROVED' as const };
          }
          return r;
        });

        const targetReview = c.reviews.find(r => r.id === reviewId);
        const logs = targetReview ? [
          {
            id: `act-rev-${Date.now()}`,
            action: 'REVIEW' as const,
            title: 'Product Review Approved',
            description: `Review for ${targetReview.productName} published.`,
            timestamp: new Date().toISOString()
          },
          ...c.activityLogs
        ] : c.activityLogs;

        return { ...c, reviews: updatedReviews, activityLogs: logs };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  rejectReview: (customerId, reviewId) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const updatedReviews = c.reviews.map(r => {
          if (r.id === reviewId) return { ...r, status: 'REJECTED' as const };
          return r;
        });
        return { ...c, reviews: updatedReviews };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  deleteReview: (customerId, reviewId) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const filtered = c.reviews.filter(r => r.id !== reviewId);
        return { ...c, reviews: filtered };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  replyToReview: (customerId, reviewId, replyText) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const updatedReviews = c.reviews.map(r => {
          if (r.id === reviewId) return { ...r, replyText };
          return r;
        });
        return { ...c, reviews: updatedReviews };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  // 9. SUPPORT TICKETS ACTIONS
  addTicket: (customerId, title, department, priority, category, initialMessage, attachments) => {
    let newlyCreatedTicket!: SupportTicket;

    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const newTicketNum = `TKT-${Date.now().toString().slice(-4)}`;
        const newTicket: SupportTicket = {
          id: `tkt-${Date.now()}`,
          ticketNumber: newTicketNum,
          title,
          customerId,
          customerName: `${c.firstName} ${c.lastName}`,
          priority,
          department,
          category,
          status: 'OPEN',
          attachments,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [
            {
              id: `msg-${Date.now()}-init`,
              sender: 'CUSTOMER',
              senderName: `${c.firstName} ${c.lastName}`,
              content: initialMessage,
              timestamp: new Date().toISOString()
            }
          ]
        };

        newlyCreatedTicket = newTicket;

        return {
          ...c,
          tickets: [newTicket, ...c.tickets],
          activityLogs: [
            {
              id: `act-tkt-${Date.now()}`,
              action: 'SUPPORT_TICKET' as const,
              title: `Support Ticket Created: ${newTicketNum}`,
              description: title,
              referenceId: newTicket.id,
              timestamp: new Date().toISOString()
            },
            ...c.activityLogs
          ]
        };
      }
      return c;
    });

    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
    return newlyCreatedTicket;
  },

  addTicketMessage: (ticketId, sender, senderName, content, attachments) => {
    const updated = get().customers.map(c => {
      // Find customer that has this ticket
      if (c.tickets.some(t => t.id === ticketId)) {
        const updatedTickets = c.tickets.map(t => {
          if (t.id === ticketId) {
            const newMsg: TicketMessage = {
              id: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
              sender,
              senderName,
              content,
              attachments,
              timestamp: new Date().toISOString()
            };

            const autoStatusUpdate: SupportTicket['status'] = (sender === 'STAFF' && t.status === 'OPEN') ? 'ASSIGNED' : t.status;

            return {
              ...t,
              status: autoStatusUpdate,
              messages: [...t.messages, newMsg],
              updatedAt: new Date().toISOString()
            };
          }
          return t;
        });

        return { ...c, tickets: updatedTickets };
      }
      return c;
    });

    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  assignTicketStaff: (ticketId, staffId, staffName) => {
    const updated = get().customers.map(c => {
      if (c.tickets.some(t => t.id === ticketId)) {
        const updatedTickets = c.tickets.map(t => {
          if (t.id === ticketId) {
            return {
              ...t,
              assignedStaffId: staffId,
              assignedStaffName: staffName,
              status: 'ASSIGNED' as const,
              updatedAt: new Date().toISOString()
            };
          }
          return t;
        });
        return { ...c, tickets: updatedTickets };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  updateTicketStatus: (ticketId, status) => {
    const updated = get().customers.map(c => {
      if (c.tickets.some(t => t.id === ticketId)) {
        const updatedTickets = c.tickets.map(t => {
          if (t.id === ticketId) {
            return {
              ...t,
              status,
              updatedAt: new Date().toISOString()
            };
          }
          return t;
        });
        return { ...c, tickets: updatedTickets };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  addTicketInternalNotes: (ticketId, notes) => {
    const updated = get().customers.map(c => {
      if (c.tickets.some(t => t.id === ticketId)) {
        const updatedTickets = c.tickets.map(t => {
          if (t.id === ticketId) return { ...t, internalNotes: notes, updatedAt: new Date().toISOString() };
          return t;
        });
        return { ...c, tickets: updatedTickets };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  // 10. CUSTOMER NOTES ACTIONS
  addCustomerNote: (customerId, content, type, author) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const newNote: CustomerNote = {
          id: `note-${Date.now()}`,
          content,
          type,
          isPinned: false,
          author,
          createdAt: new Date().toISOString()
        };
        return { ...c, notes: [newNote, ...c.notes] };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  togglePinNote: (customerId, noteId) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const updatedNotes = c.notes.map(n => {
          if (n.id === noteId) return { ...n, isPinned: !n.isPinned };
          return n;
        });
        return { ...c, notes: updatedNotes };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  deleteCustomerNote: (customerId, noteId) => {
    const updated = get().customers.map(c => {
      if (c.id === customerId) {
        const filtered = c.notes.filter(n => n.id !== noteId);
        return { ...c, notes: filtered };
      }
      return c;
    });
    set({ customers: updated });
    saveToStorage('ent_crm_customers', updated);
  },

  // 11. GROUPS ACTIONS
  addGroup: (data) => {
    const newGroup: CustomerGroup = {
      ...data,
      id: `g-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...get().groups, newGroup];
    set({ groups: updated });
    saveToStorage('ent_crm_groups', updated);
  },

  updateGroup: (id, updatedFields) => {
    const updated = get().groups.map(g => (g.id === id ? { ...g, ...updatedFields } : g));
    set({ groups: updated });
    saveToStorage('ent_crm_groups', updated);

    // Sync group name across customers if name was altered
    if (updatedFields.name) {
      const customersUpdated = get().customers.map(c => {
        if (c.groupId === id) return { ...c, groupName: updatedFields.name! };
        return c;
      });
      set({ customers: customersUpdated });
      saveToStorage('ent_crm_customers', customersUpdated);
    }
  },

  deleteGroup: (id) => {
    const updated = get().groups.filter(g => g.id !== id);
    set({ groups: updated });
    saveToStorage('ent_crm_groups', updated);
  },

  // 12. SEGMENTS ACTIONS
  addSegment: (data) => {
    const newSegment: CustomerSegment = {
      ...data,
      id: `seg-${Date.now()}`,
      memberCount: 0,
      createdAt: new Date().toISOString()
    };
    const updated = [...get().segments, newSegment];
    set({ segments: updated });
    saveToStorage('ent_crm_segments', updated);
    get().recalculateSegmentMembers();
  },

  updateSegment: (id, updatedFields) => {
    const updated = get().segments.map(s => (s.id === id ? { ...s, ...updatedFields } : s));
    set({ segments: updated });
    saveToStorage('ent_crm_segments', updated);
    get().recalculateSegmentMembers();
  },

  deleteSegment: (id) => {
    const updated = get().segments.filter(s => s.id !== id);
    set({ segments: updated });
    saveToStorage('ent_crm_segments', updated);
  },

  // 13. RE-CALCULATE MEMBER COUNTS IN SEGMENTS
  recalculateSegmentMembers: () => {
    const customers = get().customers;
    const segments = get().segments;

    const updated = segments.map(seg => {
      const config = seg.queryConfig || {};
      const rules = seg.rules || {};
      const minOrders = config.minOrders;
      const minRevenue = config.minRevenue !== undefined ? config.minRevenue : rules.minRevenue;
      const country = config.country;
      const city = config.city;
      const registeredAfter = config.registeredAfter;
      const lastLoginAfter = config.lastLoginAfter;
      const minLoyaltyPoints = config.minLoyaltyPoints !== undefined ? config.minLoyaltyPoints : rules.minPoints;
      const minWalletBalance = config.minWalletBalance !== undefined ? config.minWalletBalance : rules.minWallet;
      
      const members = customers.filter(c => {
        // Evaluate condition criteria
        if (minRevenue !== undefined) {
          // Accumulate deposit transaction volumes
          const revenueValue = c.walletTransactions
            .filter(t => t.type === 'DEBIT' && t.purpose === 'ORDER_PAYMENT')
            .reduce((sum, t) => sum + t.amount, 0);
          if (revenueValue < minRevenue) return false;
        }

        if (minWalletBalance !== undefined && c.walletBalance < minWalletBalance) return false;
        if (minLoyaltyPoints !== undefined && c.rewardPoints < minLoyaltyPoints) return false;

        if (country) {
          const hasCountry = c.addresses.some(a => a.country.toLowerCase().includes(country.toLowerCase()));
          if (!hasCountry) return false;
        }

        if (city) {
          const hasCity = c.addresses.some(a => a.city.toLowerCase().includes(city.toLowerCase()));
          if (!hasCity) return false;
        }

        if (registeredAfter && new Date(c.createdAt) < new Date(registeredAfter)) return false;
        if (lastLoginAfter && (!c.lastLoginAt || new Date(c.lastLoginAt) < new Date(lastLoginAfter))) return false;

        return true;
      });

      return {
        ...seg,
        memberCount: members.length
      };
    });

    set({ segments: updated });
    saveToStorage('ent_crm_segments', updated);
  }
}));
