/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { NavTab, Task, PlannerItem, AppSettings } from './types';
import { storage } from './services/storage';
import { soundService } from './services/sound';
import { 
  auth, 
  db, 
  syncTaskToCloud, 
  deleteTaskFromCloud, 
  syncPlannerToCloud, 
  deletePlannerFromCloud, 
  syncSettingsToCloud,
  handleFirestoreError,
  OperationType 
} from './services/firebase';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';
import { PlannerView } from './components/planner/PlannerView';
import { TimerView } from './components/timer/TimerView';
import { ClockView } from './components/clock/ClockView';
import { MoreView } from './components/more/MoreView';
import { CreateModal } from './components/modals/CreateModal';
import { EditTaskModal } from './components/modals/EditTaskModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [currentTab, setCurrentTab] = useState<NavTab>('planner');
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [plannerItems, setPlannerItems] = useState<PlannerItem[]>(() => storage.getPlannerItems());
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createInitialMode, setCreateInitialMode] = useState<'task' | 'planner'>('task');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Save user profile in Firestore
        const userRef = doc(db, 'users', user.uid);
        setDoc(userRef, {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          updatedAt: new Date().toISOString(),
        }, { merge: true }).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to user's real-time Cloud Firestore collections when logged in
  useEffect(() => {
    if (!currentUser) return;

    const tasksColRef = collection(db, 'users', currentUser.uid, 'tasks');
    const unsubTasks = onSnapshot(
      tasksColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudTasks: Task[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            cloudTasks.push({
              id: docSnap.id,
              title: data.title,
              description: data.description,
              date: data.date,
              time: data.time,
              completed: !!data.completed,
              completedAt: data.completedAt,
              emoji: data.emoji || '📚',
              iconName: data.iconName,
              bgColor: data.bgColor || '#EFF6FF',
              accentColor: data.accentColor || '#3B82F6',
              priority: data.priority || 'medium',
              category: data.category || 'General',
              createdAt: data.createdAt || new Date().toISOString(),
            });
          });
          setTasks(cloudTasks);
        } else {
          // Initial sync: Upload local tasks to cloud for this new user account
          const currentLocal = storage.getTasks();
          currentLocal.forEach((t) => {
            syncTaskToCloud(currentUser.uid, t);
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${currentUser.uid}/tasks`);
      }
    );

    const plannerColRef = collection(db, 'users', currentUser.uid, 'planner');
    const unsubPlanner = onSnapshot(
      plannerColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudPlanner: PlannerItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            cloudPlanner.push({
              id: docSnap.id,
              title: data.title,
              subject: data.subject,
              date: data.date,
              startTime: data.startTime,
              endTime: data.endTime,
              location: data.location,
              notes: data.notes,
              color: data.color || '#3B82F6',
              completed: !!data.completed,
            });
          });
          setPlannerItems(cloudPlanner);
        } else {
          const currentLocal = storage.getPlannerItems();
          currentLocal.forEach((p) => {
            syncPlannerToCloud(currentUser.uid, p);
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${currentUser.uid}/planner`);
      }
    );

    return () => {
      unsubTasks();
      unsubPlanner();
    };
  }, [currentUser]);

  // Sync state to LocalStorage
  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storage.savePlannerItems(plannerItems);
  }, [plannerItems]);

  useEffect(() => {
    storage.saveSettings(settings);
  }, [settings]);

  // Handle Theme Classes on document element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'midnight') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Task Operations
  const handleToggleCompleteTask = (id: string) => {
    if (settings.soundEnabled) {
      soundService.playCheckboxSnap(settings.soundVolume);
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          const updated = {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
          if (currentUser) {
            syncTaskToCloud(currentUser.uid, updated);
          }
          return updated;
        }
        return t;
      })
    );

    setSettings((prev) => {
      const updated = {
        ...prev,
        completedTasksCount: prev.completedTasksCount + 1,
      };
      if (currentUser) {
        syncSettingsToCloud(currentUser.uid, updated);
      }
      return updated;
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (currentUser) {
      deleteTaskFromCloud(currentUser.uid, id);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEditedTask = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    if (currentUser) {
      syncTaskToCloud(currentUser.uid, updated);
    }
  };

  const handleCreateTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    if (currentUser) {
      syncTaskToCloud(currentUser.uid, newTask);
    }
  };

  // Planner Schedule Operations
  const handleCreatePlannerItem = (newItemData: Omit<PlannerItem, 'id'>) => {
    const newItem: PlannerItem = {
      ...newItemData,
      id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setPlannerItems((prev) => [...prev, newItem]);
    if (currentUser) {
      syncPlannerToCloud(currentUser.uid, newItem);
    }
  };

  const handleDeletePlannerItem = (id: string) => {
    setPlannerItems((prev) => prev.filter((item) => item.id !== id));
    if (currentUser) {
      deletePlannerFromCloud(currentUser.uid, id);
    }
  };

  const handleTogglePlannerItem = (id: string) => {
    setPlannerItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, completed: !item.completed };
          if (currentUser) {
            syncPlannerToCloud(currentUser.uid, updated);
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Timer Session Log
  const handleTimerSessionComplete = (minutes: number) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        totalFocusMinutesCompleted: prev.totalFocusMinutesCompleted + minutes,
      };
      if (currentUser) {
        syncSettingsToCloud(currentUser.uid, updated);
      }
      return updated;
    });
  };

  // Settings update
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    if (currentUser) {
      syncSettingsToCloud(currentUser.uid, newSettings);
    }
  };

  // Data Export / Import / Reset
  const handleExportData = () => {
    const jsonStr = storage.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `studyflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string): boolean => {
    const success = storage.importData(jsonStr);
    if (success) {
      const newTasks = storage.getTasks();
      const newPlanner = storage.getPlannerItems();
      const newSettings = storage.getSettings();
      setTasks(newTasks);
      setPlannerItems(newPlanner);
      setSettings(newSettings);

      if (currentUser) {
        newTasks.forEach((t) => syncTaskToCloud(currentUser.uid, t));
        newPlanner.forEach((p) => syncPlannerToCloud(currentUser.uid, p));
        syncSettingsToCloud(currentUser.uid, newSettings);
      }
    }
    return success;
  };

  const handleResetData = () => {
    storage.resetAll();
    const initTasks = storage.getTasks();
    const initPlanner = storage.getPlannerItems();
    const initSettings = storage.getSettings();
    setTasks(initTasks);
    setPlannerItems(initPlanner);
    setSettings(initSettings);
  };

  const openCreateModal = (mode: 'task' | 'planner' = 'task') => {
    setCreateInitialMode(mode);
    setIsCreateOpen(true);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const getBackgroundClass = () => {
    if (settings.theme === 'midnight') {
      return 'bg-slate-950 text-slate-100';
    }
    if (settings.theme === 'cream') {
      return 'bg-[#FAF8F5] text-stone-800';
    }
    return 'bg-[#F9FAFC] text-slate-900';
  };

  return (
    <div className={`min-h-screen flex flex-col relative selection:bg-blue-500/20 ${getBackgroundClass()} transition-colors duration-300 font-sans`}>
      
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {settings.theme === 'midnight' ? (
          <>
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-900/15 blur-3xl" />
            <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-indigo-950/20 blur-3xl" />
            <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-purple-900/10 blur-3xl" />
          </>
        ) : settings.theme === 'cream' ? (
          <>
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl" />
            <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-orange-100/30 blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl" />
            <div className="absolute top-1/3 -right-28 w-96 h-96 rounded-full bg-indigo-100/40 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-sky-100/40 blur-3xl" />
          </>
        )}

        {/* Geometric subtle grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.04]">
          <defs>
            <pattern id="grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Adaptive Top Navigation Header with Google User Account */}
      <TopHeader
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCreate={() => openCreateModal('task')}
        completedCount={completedCount}
        totalCount={totalCount}
        focusMinutes={settings.totalFocusMinutesCompleted}
        user={currentUser}
        onLoginSuccess={(u) => setCurrentUser(u)}
        onLogoutSuccess={() => setCurrentUser(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 relative z-10">
        {currentTab === 'planner' && (
          <PlannerView
            tasks={tasks}
            plannerItems={plannerItems}
            onToggleCompleteTask={handleToggleCompleteTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onDeletePlannerItem={handleDeletePlannerItem}
            onTogglePlannerItem={handleTogglePlannerItem}
            onOpenCreate={openCreateModal}
            streakDays={settings.streakDays}
            focusMinutesToday={settings.totalFocusMinutesCompleted}
            user={currentUser}
            preferredHandle={settings.preferredHandle}
            onUpdatePreferredHandle={(handle) => {
              handleUpdateSettings({ ...settings, preferredHandle: handle });
            }}
          />
        )}

        {currentTab === 'timer' && (
          <TimerView
            onSessionComplete={handleTimerSessionComplete}
            soundEnabled={settings.soundEnabled}
            soundVolume={settings.soundVolume}
          />
        )}

        {currentTab === 'clock' && (
          <ClockView
            clockFormat={settings.clockFormat}
            showSeconds={settings.showClockSeconds}
            onToggleFormat={() => {
              const updated = {
                ...settings,
                clockFormat: settings.clockFormat === '12h' ? ('24h' as const) : ('12h' as const),
              };
              handleUpdateSettings(updated);
            }}
          />
        )}

        {currentTab === 'more' && (
          <MoreView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onResetData={handleResetData}
            user={currentUser}
            onLoginSuccess={(u) => setCurrentUser(u)}
            onLogoutSuccess={() => setCurrentUser(null)}
            onNavigateToClock={() => setCurrentTab('clock')}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCreate={() => openCreateModal('task')}
      />

      {/* Create Modal */}
      <CreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateTask={handleCreateTask}
        onCreatePlannerItem={handleCreatePlannerItem}
        initialMode={createInitialMode}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSaveTask={handleSaveEditedTask}
      />

    </div>
  );
}
