# NoteFlow - Full Stack Note-Taking Application Specification

## 1. Project Overview

**App Name:** NoteFlow  
**Purpose:** A modern, intuitive note-taking web application that allows users to create, organize, and manage notes with rich text editing, folder organization, tagging, and search capabilities.

**Tech Stack:**

- **Frontend:** React 18+ with TypeScript, Vite, TailwindCSS
- **Backend:** Node.js with Express.js, TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with HTTP-only cookies
- **State Management:** Zustand
- **Rich Text:** TipTap editor

---

## 2. Core Features

1. User authentication (register, login, logout, password reset)
2. Create, read, update, delete notes (CRUD)
3. Rich text editing (bold, italic, headings, lists, code blocks, links)
4. Folder/notebook organization
5. Tagging system
6. Full-text search
7. Favorites/pinned notes
8. Trash with restore/permanent delete
9. Auto-save with debouncing
10. Dark/light theme toggle

---

## 3. Data Models (MongoDB Schemas)

```json
{
  "User": {
    "collection": "users",
    "schema": {
      "_id": "ObjectId",
      "email": {
        "type": "String",
        "required": true,
        "unique": true,
        "lowercase": true,
        "trim": true
      },
      "password": {
        "type": "String",
        "required": true,
        "minLength": 8,
        "description": "Hashed with bcrypt, 12 salt rounds"
      },
      "name": {
        "type": "String",
        "required": true,
        "trim": true,
        "maxLength": 100
      },
      "avatar": {
        "type": "String",
        "default": null,
        "description": "URL to avatar image or null for default"
      },
      "theme": {
        "type": "String",
        "enum": ["light", "dark", "system"],
        "default": "system"
      },
      "createdAt": "Date",
      "updatedAt": "Date"
    },
    "indexes": [{ "field": "email", "unique": true }]
  },

  "Folder": {
    "collection": "folders",
    "schema": {
      "_id": "ObjectId",
      "userId": {
        "type": "ObjectId",
        "ref": "User",
        "required": true
      },
      "name": {
        "type": "String",
        "required": true,
        "trim": true,
        "maxLength": 100
      },
      "color": {
        "type": "String",
        "default": "#6366f1",
        "description": "Hex color code for folder icon"
      },
      "parentId": {
        "type": "ObjectId",
        "ref": "Folder",
        "default": null,
        "description": "For nested folders, null means root level"
      },
      "order": {
        "type": "Number",
        "default": 0,
        "description": "For custom sorting"
      },
      "createdAt": "Date",
      "updatedAt": "Date"
    },
    "indexes": [{ "field": "userId" }, { "fields": ["userId", "parentId"] }]
  },

  "Note": {
    "collection": "notes",
    "schema": {
      "_id": "ObjectId",
      "userId": {
        "type": "ObjectId",
        "ref": "User",
        "required": true
      },
      "folderId": {
        "type": "ObjectId",
        "ref": "Folder",
        "default": null,
        "description": "null means note is in root/All Notes"
      },
      "title": {
        "type": "String",
        "default": "Untitled",
        "trim": true,
        "maxLength": 255
      },
      "content": {
        "type": "String",
        "default": "",
        "description": "HTML content from TipTap editor"
      },
      "plainText": {
        "type": "String",
        "default": "",
        "description": "Plain text extracted for search indexing"
      },
      "tags": {
        "type": "[String]",
        "default": [],
        "description": "Array of tag names"
      },
      "isPinned": {
        "type": "Boolean",
        "default": false
      },
      "isTrashed": {
        "type": "Boolean",
        "default": false
      },
      "trashedAt": {
        "type": "Date",
        "default": null,
        "description": "When note was moved to trash"
      },
      "createdAt": "Date",
      "updatedAt": "Date"
    },
    "indexes": [
      { "field": "userId" },
      { "fields": ["userId", "folderId"] },
      { "fields": ["userId", "isTrashed"] },
      { "fields": ["userId", "isPinned"] },
      { "field": "tags" },
      {
        "field": "plainText",
        "type": "text",
        "description": "Full-text search index"
      }
    ]
  },

  "RefreshToken": {
    "collection": "refreshtokens",
    "schema": {
      "_id": "ObjectId",
      "userId": {
        "type": "ObjectId",
        "ref": "User",
        "required": true
      },
      "token": {
        "type": "String",
        "required": true
      },
      "expiresAt": {
        "type": "Date",
        "required": true
      },
      "createdAt": "Date"
    },
    "indexes": [
      { "field": "token", "unique": true },
      { "field": "userId" },
      { "field": "expiresAt", "expireAfterSeconds": 0 }
    ]
  }
}
```

---

## 4. API Endpoints

```json
{
  "baseUrl": "/api/v1",
  "endpoints": {
    "auth": {
      "POST /auth/register": {
        "description": "Register new user",
        "body": {
          "email": "string, required, valid email",
          "password": "string, required, min 8 chars, 1 uppercase, 1 number",
          "name": "string, required, 2-100 chars"
        },
        "response": {
          "201": {
            "user": { "id": "string", "email": "string", "name": "string" },
            "message": "Registration successful"
          },
          "400": { "error": "Validation error message" },
          "409": { "error": "Email already registered" }
        },
        "cookies": ["accessToken (15min)", "refreshToken (7d)"]
      },
      "POST /auth/login": {
        "description": "Login user",
        "body": {
          "email": "string, required",
          "password": "string, required"
        },
        "response": {
          "200": {
            "user": {
              "id": "string",
              "email": "string",
              "name": "string",
              "theme": "string"
            }
          },
          "401": { "error": "Invalid credentials" }
        },
        "cookies": ["accessToken (15min)", "refreshToken (7d)"]
      },
      "POST /auth/logout": {
        "description": "Logout user",
        "auth": "required",
        "response": {
          "200": { "message": "Logged out successfully" }
        },
        "cookies": ["clear accessToken", "clear refreshToken"]
      },
      "POST /auth/refresh": {
        "description": "Refresh access token",
        "cookies": ["refreshToken required"],
        "response": {
          "200": { "message": "Token refreshed" },
          "401": { "error": "Invalid refresh token" }
        }
      },
      "GET /auth/me": {
        "description": "Get current user",
        "auth": "required",
        "response": {
          "200": {
            "user": {
              "id": "string",
              "email": "string",
              "name": "string",
              "avatar": "string|null",
              "theme": "string"
            }
          }
        }
      },
      "PATCH /auth/me": {
        "description": "Update user profile",
        "auth": "required",
        "body": {
          "name": "string, optional",
          "theme": "string, optional, enum: light|dark|system"
        },
        "response": {
          "200": { "user": "updated user object" }
        }
      },
      "POST /auth/change-password": {
        "description": "Change password",
        "auth": "required",
        "body": {
          "currentPassword": "string, required",
          "newPassword": "string, required, min 8 chars"
        },
        "response": {
          "200": { "message": "Password changed successfully" },
          "401": { "error": "Current password is incorrect" }
        }
      }
    },

    "folders": {
      "GET /folders": {
        "description": "Get all folders for user",
        "auth": "required",
        "query": {
          "parentId": "string, optional, filter by parent folder"
        },
        "response": {
          "200": { "folders": "[Folder objects with noteCount]" }
        }
      },
      "POST /folders": {
        "description": "Create new folder",
        "auth": "required",
        "body": {
          "name": "string, required, 1-100 chars",
          "color": "string, optional, hex color",
          "parentId": "string, optional, parent folder id"
        },
        "response": {
          "201": { "folder": "created folder object" },
          "400": { "error": "Validation error" }
        }
      },
      "PATCH /folders/:id": {
        "description": "Update folder",
        "auth": "required",
        "params": { "id": "folder ObjectId" },
        "body": {
          "name": "string, optional",
          "color": "string, optional",
          "parentId": "string, optional"
        },
        "response": {
          "200": { "folder": "updated folder object" },
          "404": { "error": "Folder not found" }
        }
      },
      "DELETE /folders/:id": {
        "description": "Delete folder (moves notes to root, deletes subfolders recursively)",
        "auth": "required",
        "params": { "id": "folder ObjectId" },
        "response": {
          "200": { "message": "Folder deleted", "movedNotesCount": "number" },
          "404": { "error": "Folder not found" }
        }
      }
    },

    "notes": {
      "GET /notes": {
        "description": "Get notes with filters",
        "auth": "required",
        "query": {
          "folderId": "string, optional, filter by folder (use 'root' for unfiled)",
          "search": "string, optional, full-text search",
          "tag": "string, optional, filter by tag",
          "pinned": "boolean, optional, filter pinned only",
          "trashed": "boolean, optional, show trashed notes (default false)",
          "sort": "string, optional, enum: updatedAt|createdAt|title (default: updatedAt)",
          "order": "string, optional, enum: asc|desc (default: desc)",
          "page": "number, optional, default 1",
          "limit": "number, optional, default 50, max 100"
        },
        "response": {
          "200": {
            "notes": "[Note objects without full content]",
            "pagination": {
              "page": "number",
              "limit": "number",
              "total": "number",
              "pages": "number"
            }
          }
        }
      },
      "GET /notes/:id": {
        "description": "Get single note with full content",
        "auth": "required",
        "params": { "id": "note ObjectId" },
        "response": {
          "200": { "note": "full note object" },
          "404": { "error": "Note not found" }
        }
      },
      "POST /notes": {
        "description": "Create new note",
        "auth": "required",
        "body": {
          "title": "string, optional, default 'Untitled'",
          "content": "string, optional, HTML content",
          "folderId": "string, optional",
          "tags": "[string], optional"
        },
        "response": {
          "201": { "note": "created note object" }
        }
      },
      "PATCH /notes/:id": {
        "description": "Update note",
        "auth": "required",
        "params": { "id": "note ObjectId" },
        "body": {
          "title": "string, optional",
          "content": "string, optional",
          "folderId": "string|null, optional",
          "tags": "[string], optional",
          "isPinned": "boolean, optional"
        },
        "response": {
          "200": { "note": "updated note object" },
          "404": { "error": "Note not found" }
        }
      },
      "POST /notes/:id/trash": {
        "description": "Move note to trash",
        "auth": "required",
        "params": { "id": "note ObjectId" },
        "response": {
          "200": { "note": "trashed note object" }
        }
      },
      "POST /notes/:id/restore": {
        "description": "Restore note from trash",
        "auth": "required",
        "params": { "id": "note ObjectId" },
        "response": {
          "200": { "note": "restored note object" }
        }
      },
      "DELETE /notes/:id": {
        "description": "Permanently delete note",
        "auth": "required",
        "params": { "id": "note ObjectId" },
        "response": {
          "200": { "message": "Note permanently deleted" }
        }
      },
      "POST /notes/bulk-trash": {
        "description": "Move multiple notes to trash",
        "auth": "required",
        "body": { "noteIds": "[string], required" },
        "response": {
          "200": { "trashedCount": "number" }
        }
      },
      "DELETE /notes/empty-trash": {
        "description": "Permanently delete all trashed notes",
        "auth": "required",
        "response": {
          "200": { "deletedCount": "number" }
        }
      }
    },

    "tags": {
      "GET /tags": {
        "description": "Get all tags with note counts",
        "auth": "required",
        "response": {
          "200": { "tags": "[{ name: string, count: number }]" }
        }
      }
    }
  }
}
```

---

## 5. User Stories & Acceptance Criteria

### Epic 1: Authentication

```json
{
  "US-001": {
    "title": "User Registration",
    "story": "As a new user, I want to create an account so that I can save my notes securely.",
    "acceptanceCriteria": [
      "User can access registration form from landing page",
      "Form requires email, password, and name fields",
      "Email must be valid format and unique",
      "Password must be at least 8 characters with 1 uppercase and 1 number",
      "Password field has show/hide toggle",
      "Form shows inline validation errors in real-time",
      "Successful registration redirects to notes dashboard",
      "User receives success toast notification",
      "Duplicate email shows appropriate error message"
    ],
    "priority": "P0"
  },
  "US-002": {
    "title": "User Login",
    "story": "As a registered user, I want to log in so that I can access my notes.",
    "acceptanceCriteria": [
      "User can access login form from landing page",
      "Form requires email and password",
      "Invalid credentials show generic error (security)",
      "Successful login redirects to notes dashboard",
      "Remember me checkbox extends session to 30 days",
      "Link to registration page is visible"
    ],
    "priority": "P0"
  },
  "US-003": {
    "title": "User Logout",
    "story": "As a logged-in user, I want to log out so that my account is secure.",
    "acceptanceCriteria": [
      "Logout option in user menu dropdown",
      "Clicking logout clears session immediately",
      "User is redirected to login page",
      "Attempting to access protected routes redirects to login"
    ],
    "priority": "P0"
  }
}
```

### Epic 2: Notes Management

```json
{
  "US-010": {
    "title": "Create New Note",
    "story": "As a user, I want to create a new note so that I can capture my thoughts.",
    "acceptanceCriteria": [
      "Clicking 'New Note' button creates note immediately (no modal)",
      "New note opens in editor with cursor in title field",
      "Default title is 'Untitled'",
      "Note is created in currently selected folder (or root if none)",
      "Note auto-saves after 1 second of inactivity (debounced)",
      "Save indicator shows 'Saving...' then 'Saved' states",
      "Empty notes are auto-deleted when navigating away"
    ],
    "priority": "P0"
  },
  "US-011": {
    "title": "Edit Note with Rich Text",
    "story": "As a user, I want to format my notes with rich text so they are easier to read.",
    "acceptanceCriteria": [
      "Editor supports: bold, italic, underline, strikethrough",
      "Editor supports: H1, H2, H3 headings",
      "Editor supports: bullet lists, numbered lists, checklists",
      "Editor supports: code blocks with syntax highlighting",
      "Editor supports: blockquotes",
      "Editor supports: links (with URL input)",
      "Editor supports: horizontal dividers",
      "Keyboard shortcuts work (Ctrl+B, Ctrl+I, etc.)",
      "Formatting toolbar is visible and responsive",
      "Mobile: toolbar scrolls horizontally"
    ],
    "priority": "P0"
  },
  "US-012": {
    "title": "Delete Note (Soft Delete)",
    "story": "As a user, I want to delete notes so I can remove ones I no longer need.",
    "acceptanceCriteria": [
      "Delete option in note context menu and toolbar",
      "Deleting moves note to Trash (soft delete)",
      "Confirmation toast with 'Undo' action (5 seconds)",
      "Note disappears from list immediately",
      "Trashed notes are not shown in normal views"
    ],
    "priority": "P0"
  },
  "US-013": {
    "title": "View and Manage Trash",
    "story": "As a user, I want to view and restore deleted notes from trash.",
    "acceptanceCriteria": [
      "Trash section accessible from sidebar",
      "Trash shows all soft-deleted notes",
      "Each note has 'Restore' and 'Delete Forever' options",
      "'Empty Trash' button deletes all with confirmation",
      "Restored notes return to their original folder (or root if folder deleted)",
      "Notes in trash for 30+ days show warning badge"
    ],
    "priority": "P1"
  },
  "US-014": {
    "title": "Pin/Unpin Notes",
    "story": "As a user, I want to pin important notes so they appear at the top.",
    "acceptanceCriteria": [
      "Pin icon/button on each note",
      "Pinned notes appear in 'Pinned' section at top of list",
      "Pin state persists across sessions",
      "Can unpin by clicking again",
      "Pinned section is collapsible"
    ],
    "priority": "P1"
  },
  "US-015": {
    "title": "Search Notes",
    "story": "As a user, I want to search my notes so I can find information quickly.",
    "acceptanceCriteria": [
      "Search input in header, always visible",
      "Search is triggered on Enter or after 300ms debounce",
      "Searches note titles and content (full-text)",
      "Results show matching notes with highlighted snippets",
      "Empty results show helpful message",
      "Search can be combined with folder filter",
      "Clear button resets search"
    ],
    "priority": "P0"
  }
}
```

### Epic 3: Organization

```json
{
  "US-020": {
    "title": "Create Folder",
    "story": "As a user, I want to create folders to organize my notes.",
    "acceptanceCriteria": [
      "'+' button next to 'Folders' in sidebar",
      "Inline input appears for folder name",
      "Enter saves, Escape cancels",
      "Folder appears in list immediately",
      "Default color is applied (customizable later)",
      "Maximum 50 folders per user"
    ],
    "priority": "P0"
  },
  "US-021": {
    "title": "Move Note to Folder",
    "story": "As a user, I want to move notes between folders to stay organized.",
    "acceptanceCriteria": [
      "Folder selector dropdown in note editor",
      "Drag-and-drop note onto folder in sidebar",
      "Context menu 'Move to...' option with folder list",
      "Moving updates note immediately",
      "Can move to root (no folder) by selecting 'All Notes'"
    ],
    "priority": "P0"
  },
  "US-022": {
    "title": "Add Tags to Notes",
    "story": "As a user, I want to tag notes so I can categorize them flexibly.",
    "acceptanceCriteria": [
      "Tag input field in note editor (below title)",
      "Type and press Enter/comma to add tag",
      "Autocomplete suggests existing tags",
      "Click 'x' on tag to remove",
      "Maximum 10 tags per note",
      "Tag names are case-insensitive, stored lowercase",
      "Max 30 characters per tag"
    ],
    "priority": "P1"
  },
  "US-023": {
    "title": "Filter by Tag",
    "story": "As a user, I want to filter notes by tag to find related notes.",
    "acceptanceCriteria": [
      "Tags section in sidebar shows all used tags with counts",
      "Clicking a tag filters note list",
      "Active tag filter is visually indicated",
      "Can combine with folder filter",
      "Click again or 'x' to clear filter"
    ],
    "priority": "P1"
  }
}
```

### Epic 4: User Experience

```json
{
  "US-030": {
    "title": "Dark/Light Theme",
    "story": "As a user, I want to switch between themes for comfortable viewing.",
    "acceptanceCriteria": [
      "Theme toggle in user menu",
      "Options: Light, Dark, System",
      "System option follows OS preference",
      "Theme preference persists across sessions",
      "Smooth transition animation between themes"
    ],
    "priority": "P1"
  },
  "US-031": {
    "title": "Responsive Design",
    "story": "As a user, I want to use the app on any device.",
    "acceptanceCriteria": [
      "Desktop: sidebar + note list + editor (3-column)",
      "Tablet: collapsible sidebar + note list/editor toggle",
      "Mobile: bottom nav, full-screen views, swipe navigation",
      "Touch targets minimum 44px",
      "No horizontal scrolling at any viewport"
    ],
    "priority": "P0"
  },
  "US-032": {
    "title": "Keyboard Shortcuts",
    "story": "As a power user, I want keyboard shortcuts for common actions.",
    "acceptanceCriteria": [
      "Ctrl/Cmd + N: New note",
      "Ctrl/Cmd + S: Force save (with feedback)",
      "Ctrl/Cmd + F: Focus search",
      "Ctrl/Cmd + \\: Toggle sidebar",
      "Escape: Close modals/menus, deselect note",
      "Shortcuts reference accessible via '?' key"
    ],
    "priority": "P2"
  }
}
```

---

## 6. User Flows

### Flow 1: New User Onboarding

```
1. User lands on marketing/landing page
2. Clicks "Get Started Free" or "Sign Up"
3. Fills registration form (email, password, name)
4. Submits form → validates → creates account
5. Auto-login → redirect to dashboard
6. Empty state shown with "Create your first note" CTA
7. User clicks CTA → new note created → editor focused
```

### Flow 2: Daily Note-Taking Session

```
1. User opens app (already logged in via refresh token)
2. Dashboard loads with note list (most recent first)
3. User clicks existing note OR creates new note
4. Editor loads with note content
5. User edits content → auto-save triggers
6. User adds/removes tags as needed
7. User may move note to folder
8. User navigates to other notes or closes browser
9. All changes are persisted
```

### Flow 3: Organizing Notes

```
1. User notices too many notes in "All Notes"
2. User creates folder: "Work", "Personal", "Ideas"
3. User selects multiple notes (checkbox mode)
4. User uses "Move to..." action
5. Selects target folder
6. Notes move, counts update
7. User clicks folder in sidebar to view filtered list
```

### Flow 4: Finding Specific Note

```
1. User needs to find note about "project deadline"
2. User clicks search or presses Ctrl+F
3. Types "project deadline"
4. Results show as user types (debounced)
5. User sees matching notes with snippets
6. Clicks desired result
7. Note opens in editor
```

### Flow 5: Recovering Deleted Note

```
1. User accidentally deletes important note
2. Sees toast with "Undo" option
3. Option A: Clicks "Undo" within 5 seconds → note restored
4. Option B: Toast expires → user clicks "Trash" in sidebar
5. Finds note in trash list
6. Clicks "Restore" button
7. Note moves back to original location
```

---

## 7. UI/UX Specifications

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ ┌─────────┐  ┌──────────────────────────┐  ┌──────┐  ┌────────┐│
│ │  Logo   │  │ 🔍 Search notes...       │  │ Theme│  │ Avatar ▼││
│ └─────────┘  └──────────────────────────┘  └──────┘  └────────┘│
├──────────────┬──────────────────┬───────────────────────────────┤
│ SIDEBAR      │ NOTE LIST        │ EDITOR                        │
│ 240px fixed  │ 300px resizable  │ Flexible                      │
│              │                  │                               │
│ ┌──────────┐ │ ┌──────────────┐ │ ┌───────────────────────────┐ │
│ │+ New Note│ │ │ Note Title   │ │ │ Title Input               │ │
│ └──────────┘ │ │ Preview...   │ │ └───────────────────────────┘ │
│              │ │ 2h ago    📌 │ │ ┌───────────────────────────┐ │
│ All Notes    │ └──────────────┘ │ │ Tags: [work] [urgent] [+] │ │
│ ────────     │ ┌──────────────┐ │ └───────────────────────────┘ │
│ 📁 Work (5)  │ │ Another Note │ │ ┌───────────────────────────┐ │
│ 📁 Personal  │ │ More text... │ │ │ ┌─────────────────────────┐│ │
│ 📁 Ideas     │ │ Yesterday    │ │ │ │B│I│U│H1│H2│•│1.│<>│—│🔗││ │
│              │ └──────────────┘ │ │ └─────────────────────────┘│ │
│ ────────     │                  │ │                             │ │
│ Tags         │                  │ │ Rich text content area...   │ │
│ • work (3)   │                  │ │                             │ │
│ • urgent (2) │                  │ │                             │ │
│              │                  │ │                             │ │
│ ────────     │                  │ │                             │ │
│ 🗑️ Trash     │                  │ │                             │ │
│              │                  │ └───────────────────────────┘ │
│              │                  │              Saved ✓  Folder ▼│
└──────────────┴──────────────────┴───────────────────────────────┘
```

### Color Palette

```json
{
  "light": {
    "background": "#ffffff",
    "backgroundSecondary": "#f9fafb",
    "backgroundTertiary": "#f3f4f6",
    "text": "#111827",
    "textSecondary": "#6b7280",
    "textMuted": "#9ca3af",
    "border": "#e5e7eb",
    "primary": "#6366f1",
    "primaryHover": "#4f46e5",
    "success": "#10b981",
    "warning": "#f59e0b",
    "danger": "#ef4444",
    "dangerHover": "#dc2626"
  },
  "dark": {
    "background": "#111827",
    "backgroundSecondary": "#1f2937",
    "backgroundTertiary": "#374151",
    "text": "#f9fafb",
    "textSecondary": "#9ca3af",
    "textMuted": "#6b7280",
    "border": "#374151",
    "primary": "#818cf8",
    "primaryHover": "#6366f1",
    "success": "#34d399",
    "warning": "#fbbf24",
    "danger": "#f87171",
    "dangerHover": "#ef4444"
  }
}
```

### Typography

```json
{
  "fontFamily": {
    "sans": "Inter, system-ui, -apple-system, sans-serif",
    "mono": "JetBrains Mono, Fira Code, monospace"
  },
  "fontSize": {
    "xs": "0.75rem",
    "sm": "0.875rem",
    "base": "1rem",
    "lg": "1.125rem",
    "xl": "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem"
  },
  "fontWeight": {
    "normal": 400,
    "medium": 500,
    "semibold": 600,
    "bold": 700
  },
  "lineHeight": {
    "tight": 1.25,
    "normal": 1.5,
    "relaxed": 1.75
  }
}
```

### Component Specifications

```json
{
  "Button": {
    "variants": ["primary", "secondary", "ghost", "danger"],
    "sizes": ["sm", "md", "lg"],
    "states": ["default", "hover", "active", "disabled", "loading"],
    "borderRadius": "8px",
    "transitions": "all 150ms ease"
  },
  "Input": {
    "height": { "sm": "32px", "md": "40px", "lg": "48px" },
    "borderRadius": "8px",
    "borderWidth": "1px",
    "focusRing": "2px primary with 2px offset",
    "states": ["default", "focus", "error", "disabled"]
  },
  "NoteCard": {
    "padding": "16px",
    "borderRadius": "8px",
    "maxTitleLength": "display 2 lines with ellipsis",
    "maxPreviewLength": "display 3 lines with ellipsis",
    "hoverEffect": "subtle background change",
    "selectedState": "primary border or background tint"
  },
  "Modal": {
    "maxWidth": { "sm": "400px", "md": "560px", "lg": "720px" },
    "padding": "24px",
    "borderRadius": "12px",
    "backdrop": "rgba(0,0,0,0.5) with blur",
    "animation": "fade in + scale up"
  },
  "Toast": {
    "position": "bottom-right",
    "maxWidth": "400px",
    "duration": {
      "info": "3s",
      "success": "3s",
      "error": "5s",
      "action": "5s"
    },
    "types": ["info", "success", "warning", "error"]
  },
  "Dropdown": {
    "minWidth": "180px",
    "maxHeight": "300px with scroll",
    "itemHeight": "36px",
    "animation": "fade + slide down"
  }
}
```

### Responsive Breakpoints

```json
{
  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px"
  },
  "layouts": {
    "mobile": {
      "maxWidth": "639px",
      "sidebar": "hidden, slide-in drawer",
      "noteList": "full width view",
      "editor": "full width view",
      "navigation": "bottom tab bar"
    },
    "tablet": {
      "range": "640px - 1023px",
      "sidebar": "collapsible, overlay mode",
      "noteList": "250px when visible",
      "editor": "remaining space"
    },
    "desktop": {
      "minWidth": "1024px",
      "sidebar": "240px fixed",
      "noteList": "300px resizable",
      "editor": "remaining space, min 400px"
    }
  }
}
```

---

## 8. Frontend Architecture

### Folder Structure

```
src/
├── assets/                 # Static assets (icons, images)
├── components/
│   ├── auth/              # Login, Register forms
│   ├── common/            # Button, Input, Modal, Toast, etc.
│   ├── editor/            # TipTap editor components
│   ├── layout/            # Header, Sidebar, MainLayout
│   ├── notes/             # NoteCard, NoteList, NoteEditor
│   ├── folders/           # FolderList, FolderItem
│   └── tags/              # TagInput, TagList
├── hooks/
│   ├── useAuth.ts         # Auth state and actions
│   ├── useNotes.ts        # Notes CRUD operations
│   ├── useFolders.ts      # Folders CRUD operations
│   ├── useSearch.ts       # Search with debounce
│   ├── useAutoSave.ts     # Debounced auto-save logic
│   └── useKeyboardShortcuts.ts
├── lib/
│   ├── api.ts             # Axios instance with interceptors
│   ├── utils.ts           # Helper functions
│   └── constants.ts       # App constants
├── pages/
│   ├── Landing.tsx        # Marketing/landing page
│   ├── Login.tsx          # Login page
│   ├── Register.tsx       # Registration page
│   ├── Dashboard.tsx      # Main app (notes view)
│   └── NotFound.tsx       # 404 page
├── stores/
│   ├── authStore.ts       # User auth state (Zustand)
│   ├── noteStore.ts       # Notes state
│   ├── folderStore.ts     # Folders state
│   ├── uiStore.ts         # UI state (sidebar, modals, theme)
│   └── index.ts           # Combined store exports
├── styles/
│   ├── globals.css        # Global styles, Tailwind imports
│   └── editor.css         # TipTap editor custom styles
├── types/
│   └── index.ts           # TypeScript interfaces
├── App.tsx                # Router setup
├── main.tsx               # Entry point
└── vite-env.d.ts
```

### State Management (Zustand Stores)

```typescript
// types/index.ts
interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  theme: "light" | "dark" | "system";
}

interface Note {
  _id: string;
  title: string;
  content: string;
  plainText: string;
  folderId: string | null;
  tags: string[];
  isPinned: boolean;
  isTrashed: boolean;
  trashedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Folder {
  _id: string;
  name: string;
  color: string;
  parentId: string | null;
  order: number;
  noteCount?: number;
}

// stores/authStore.ts
interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// stores/noteStore.ts
interface NoteStore {
  notes: Note[];
  activeNoteId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
  filters: {
    folderId: string | null;
    tag: string | null;
    search: string;
    trashed: boolean;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  fetchNotes: () => Promise<void>;
  getNote: (id: string) => Promise<Note>;
  createNote: (folderId?: string) => Promise<Note>;
  updateNote: (id: string, data: Partial<Note>) => Promise<void>;
  trashNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
  setActiveNote: (id: string | null) => void;
  setFilter: (filter: Partial<NoteStore["filters"]>) => void;
}

// stores/folderStore.ts
interface FolderStore {
  folders: Folder[];
  isLoading: boolean;
  fetchFolders: () => Promise<void>;
  createFolder: (name: string, color?: string) => Promise<Folder>;
  updateFolder: (id: string, data: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
}

// stores/uiStore.ts
interface UIStore {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  activeModal: string | null;
  toasts: Toast[];
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  openModal: (modal: string) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}
```

---

## 9. Backend Architecture

### Folder Structure

```
src/
├── config/
│   ├── db.ts              # MongoDB connection
│   ├── env.ts             # Environment variables validation
│   └── cors.ts            # CORS configuration
├── controllers/
│   ├── authController.ts
│   ├── noteController.ts
│   ├── folderController.ts
│   └── tagController.ts
├── middleware/
│   ├── auth.ts            # JWT verification
│   ├── validate.ts        # Request validation
│   ├── errorHandler.ts    # Global error handler
│   └── rateLimiter.ts     # Rate limiting
├── models/
│   ├── User.ts
│   ├── Note.ts
│   ├── Folder.ts
│   └── RefreshToken.ts
├── routes/
│   ├── auth.ts
│   ├── notes.ts
│   ├── folders.ts
│   ├── tags.ts
│   └── index.ts           # Route aggregator
├── services/
│   ├── authService.ts     # Auth business logic
│   ├── noteService.ts     # Note business logic
│   └── folderService.ts   # Folder business logic
├── utils/
│   ├── jwt.ts             # JWT helpers
│   ├── password.ts        # Bcrypt helpers
│   ├── sanitize.ts        # HTML sanitization
│   └── extractText.ts     # HTML to plain text
├── validators/
│   ├── authValidators.ts  # Zod schemas for auth
│   ├── noteValidators.ts
│   └── folderValidators.ts
├── types/
│   └── index.ts           # TypeScript types
├── app.ts                 # Express app setup
└── server.ts              # Server entry point
```

### Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/noteflow

# JWT
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cookies
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false  # true in production

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Security Implementation

```json
{
  "authentication": {
    "accessToken": {
      "type": "JWT",
      "storage": "HTTP-only cookie",
      "expiry": "15 minutes",
      "payload": { "userId": "string", "email": "string" }
    },
    "refreshToken": {
      "type": "JWT",
      "storage": "HTTP-only cookie + database",
      "expiry": "7 days",
      "rotation": "new token on each refresh"
    },
    "cookies": {
      "httpOnly": true,
      "secure": true,
      "sameSite": "strict",
      "path": "/"
    }
  },
  "passwordHashing": {
    "algorithm": "bcrypt",
    "saltRounds": 12
  },
  "rateLimiting": {
    "window": "15 minutes",
    "maxRequests": {
      "general": 100,
      "auth": 10
    }
  },
  "inputValidation": {
    "library": "zod",
    "sanitization": "DOMPurify for HTML content"
  },
  "headers": {
    "helmet": true,
    "cors": "configured origins only"
  }
}
```

---

## 10. Error Handling

### Error Response Format

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "field": "fieldName (for validation errors)",
    "details": []
  }
}
```

### Error Codes

```json
{
  "AUTH_001": "Invalid credentials",
  "AUTH_002": "Email already registered",
  "AUTH_003": "Token expired",
  "AUTH_004": "Token invalid",
  "AUTH_005": "Password requirements not met",
  "VAL_001": "Validation failed",
  "VAL_002": "Required field missing",
  "NOTE_001": "Note not found",
  "NOTE_002": "Note access denied",
  "FOLDER_001": "Folder not found",
  "FOLDER_002": "Folder limit reached",
  "RATE_001": "Too many requests",
  "SERVER_001": "Internal server error"
}
```

---

## 11. Testing Requirements

```json
{
  "frontend": {
    "unit": {
      "framework": "Vitest",
      "coverage": "80% minimum",
      "targets": ["stores", "hooks", "utils"]
    },
    "component": {
      "framework": "React Testing Library",
      "coverage": "key components",
      "targets": ["forms", "note editor", "note list"]
    },
    "e2e": {
      "framework": "Playwright",
      "scenarios": [
        "user registration flow",
        "login and create note",
        "organize notes in folders",
        "search notes",
        "delete and restore note"
      ]
    }
  },
  "backend": {
    "unit": {
      "framework": "Jest",
      "coverage": "80% minimum",
      "targets": ["services", "utils", "validators"]
    },
    "integration": {
      "framework": "Supertest",
      "database": "MongoDB memory server",
      "targets": ["all API endpoints"]
    }
  }
}
```

---

## 12. Build & Deployment

### Development Setup

```bash
# Clone and setup
git clone <repo>
cd noteflow

# Backend setup
cd server
npm install
cp .env.example .env
npm run dev

# Frontend setup (new terminal)
cd client
npm install
npm run dev
```

### Production Build

```json
{
  "frontend": {
    "build": "npm run build",
    "output": "dist/",
    "hosting": "Static hosting (Vercel, Netlify, S3+CloudFront)"
  },
  "backend": {
    "build": "npm run build",
    "output": "dist/",
    "hosting": "Container or Node.js hosting (Railway, Render, AWS ECS)",
    "process_manager": "PM2 for production"
  },
  "database": {
    "hosting": "MongoDB Atlas",
    "tier": "M0 (free) for development, M10+ for production"
  }
}
```

### Docker Configuration

```dockerfile
# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

---

## 13. Performance Requirements

```json
{
  "frontend": {
    "initialLoad": "< 2 seconds on 3G",
    "timeToInteractive": "< 3 seconds",
    "bundleSize": "< 200KB gzipped (excluding TipTap)",
    "lighthouseScore": "> 90 performance"
  },
  "backend": {
    "responseTime": {
      "p50": "< 100ms",
      "p95": "< 300ms",
      "p99": "< 500ms"
    },
    "throughput": "> 100 requests/second"
  },
  "database": {
    "indexedQueries": "< 50ms",
    "fullTextSearch": "< 200ms"
  }
}
```

---

## 14. Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation for all features
- Focus management in modals and menus
- ARIA labels on interactive elements
- Color contrast ratio minimum 4.5:1
- Screen reader announcements for dynamic content
- Reduced motion support

---

## 15. Implementation Order

```json
{
  "phase1_foundation": {
    "duration": "3-4 days",
    "tasks": [
      "Project scaffolding (Vite + Express + TypeScript)",
      "MongoDB schemas and connection",
      "Auth endpoints (register, login, logout, refresh)",
      "JWT middleware and cookie handling",
      "Basic React routing and layouts",
      "Auth pages (login, register)",
      "Protected route wrapper"
    ]
  },
  "phase2_core_notes": {
    "duration": "4-5 days",
    "tasks": [
      "Note CRUD API endpoints",
      "TipTap editor integration",
      "Note list component",
      "Note editor component",
      "Auto-save with debouncing",
      "Basic Zustand stores"
    ]
  },
  "phase3_organization": {
    "duration": "3-4 days",
    "tasks": [
      "Folder CRUD API",
      "Folder sidebar component",
      "Move notes to folders",
      "Tag input and storage",
      "Tag filtering"
    ]
  },
  "phase4_features": {
    "duration": "2-3 days",
    "tasks": [
      "Full-text search API",
      "Search UI with results",
      "Pin/unpin functionality",
      "Trash and restore",
      "Empty trash"
    ]
  },
  "phase5_polish": {
    "duration": "2-3 days",
    "tasks": [
      "Dark/light theme",
      "Responsive design",
      "Toast notifications",
      "Loading states",
      "Error handling UI",
      "Keyboard shortcuts"
    ]
  }
}
```

---

## 16. Quick Reference: Commands for Claude Code

```bash
# Initialize project structure
mkdir noteflow && cd noteflow
mkdir client server

# Server initialization
cd server
npm init -y
npm install express mongoose dotenv cors cookie-parser helmet bcryptjs jsonwebtoken zod dompurify
npm install -D typescript @types/node @types/express @types/cors @types/cookie-parser @types/bcryptjs @types/jsonwebtoken nodemon ts-node

# Client initialization
cd ../client
npm create vite@latest . -- --template react-ts
npm install @tanstack/react-query axios zustand @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder react-router-dom lucide-react
npm install -D tailwindcss postcss autoprefixer @types/node
npx tailwindcss init -p
```

---

This specification provides complete details for building NoteFlow. Begin with Phase 1 (foundation) and proceed sequentially. Each component, API endpoint, and feature is defined with clear acceptance criteria.
