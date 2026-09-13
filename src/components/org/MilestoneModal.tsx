import { CheckCircle, X, Trash2, Plus, Calendar } from "lucide-react"
import { useState } from "react"
import { useOrgStore } from "@/stores/org-store"
import type { Task } from "@/stores/org-store"
import { NewTaskModal } from "./NewTaskModal"

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MilestoneModal({ isOpen, onClose }: MilestoneModalProps) {
  const { 
    milestoneTasks, 
    activeTaskId, 
    setActiveTaskId, 
    toggleTaskStatus, 
    toggleChecklistItem,
    deleteMilestoneTask,
    addChecklistItem,
    updateChecklistItem,
    removeChecklistItem
  } = useOrgStore()

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  if (!isOpen) return null;

  const totalTasks = milestoneTasks.length;
  const completedTasks = milestoneTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = milestoneTasks.filter(t => t.status === 'In Progress').length;
  const pendingTasks = milestoneTasks.filter(t => t.status === 'Pending').length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const strokeDashoffset = 251.3 - (251.3 * (progressPercent / 100));

  const getProgressColor = (percent: number) => {
    if (percent === 100) return '#10B981'; // Green
    if (percent >= 80) return '#EAB308'; // Yellow
    if (percent >= 60) return '#F59E0B'; // Orange
    return '#D9291C'; // Red
  };

  const progressColor = getProgressColor(progressPercent);

  const activeTask = milestoneTasks.find(t => t.id === activeTaskId) || milestoneTasks[0];

  const getStatusBadge = (status: Task['status']) => {
    switch(status) {
      case 'Completed': return <span className="text-[10px] font-bold text-[#059669] px-2 py-0.5 rounded-full bg-[#D1FAE5]">Completed</span>;
      case 'In Progress': return <span className="text-[10px] font-bold text-[#B45309] px-2 py-0.5 rounded-full bg-[#FEF3C7]">In Progress</span>;
      default: return <span className="text-[10px] font-bold text-[#94A3B8] px-2 py-0.5 rounded-full bg-neutral-100">Pending</span>;
    }
  }

  const getTaskIcon = (task: Task, index: number) => {
    if (task.status === 'Completed') {
      return (
        <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center shrink-0">
          <CheckCircle className="w-3.5 h-3.5 text-white" />
        </div>
      )
    }
    if (task.status === 'In Progress') {
      return (
        <div className="w-6 h-6 rounded-full border border-[#F59E0B] flex items-center justify-center bg-white shrink-0">
          <span className="text-xs font-bold text-[#F59E0B]">{index + 1}</span>
        </div>
      )
    }
    return (
      <div className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center bg-white shrink-0">
        <span className="text-xs font-bold text-[#94A3B8]">{index + 1}</span>
      </div>
    )
  }

  const getAssignedText = (task: Task) => {
    const owners = new Set(task.checklist.map(c => c.ownerName).filter(Boolean));
    if (owners.size > 1) return 'Multiple';
    if (owners.size === 1) return Array.from(owners)[0];
    return task.responsible;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl flex flex-col h-[85vh] overflow-hidden">

        <div className="p-10 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#1E293B] mb-1">APEX Tech Semestral Milestone</h2>
              <p className="text-[#64748B] text-sm">Project Apex Alpha - Jul 1 &ndash; Dec 15 &middot; Lead: Sarah Chen</p>
            </div>
            
            <div className="flex items-start gap-12">
              {/* Circular Progress & Stats */}
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-[#FEE2E2] stroke-[8px] fill-transparent" />
                    <circle cx="50" cy="50" r="40" className="stroke-[8px] fill-transparent transition-all duration-500 ease-out" style={{ stroke: progressColor }} strokeDasharray="251.3" strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="font-bold text-lg" style={{ color: progressColor }}>{progressPercent}%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                    <span className="text-[#475569]"><strong className="text-[#1E293B]">Completed</strong> &middot; {completedTasks} tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                    <span className="text-[#475569]"><strong className="text-[#1E293B]">In progress</strong> &middot; {inProgressTasks} tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
                    <span className="text-[#475569]"><strong className="text-[#1E293B]">Pending</strong> &middot; {pendingTasks} task{pendingTasks !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Header Button */}
              <button onClick={onClose} className="px-4 py-2 border border-neutral-200 rounded-lg text-xs font-semibold text-[#475569] hover:bg-neutral-50 flex items-center gap-2 shrink-0">
                 <span>&larr; Back to dashboard</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Task List */}
            <div className="lg:col-span-2">
              <div className="flex text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">
                <div className="flex-1">Task</div>
                <div className="w-24">Status</div>
                <div className="w-24">Assigned</div>
                <div className="w-8"></div>
              </div>

              <div className="flex flex-col gap-2">
                {milestoneTasks.map((task, idx) => {
                  const isActive = activeTaskId === task.id;
                  const isTitleHighlight = task.status === 'In Progress' ? 'text-[#B45309]' : 'text-[#1E293B]';
                  return (
                    <div 
                      key={task.id}
                      onClick={() => setActiveTaskId(task.id)}
                      onDoubleClick={() => toggleTaskStatus(task.id)}
                      className={`flex items-center py-3 cursor-pointer transition-colors select-none group ${isActive ? 'bg-neutral-50 -mx-4 px-4 rounded-xl' : ''} ${task.status === 'In Progress' && isActive ? 'bg-[#FFFBEB]' : ''}`}
                    >
                      <div className="flex-1 flex items-center gap-3">
                        {getTaskIcon(task, idx)}
                        <span className={`text-sm font-bold ${isTitleHighlight}`}>{task.title}</span>
                      </div>
                      <div className="w-24">
                        {getStatusBadge(task.status)}
                      </div>
                      <div className={`w-24 text-xs truncate pr-2 ${isActive ? 'text-[#1E293B] font-semibold' : 'text-[#475569]'}`}>
                        {getAssignedText(task)}
                      </div>
                      <div className="w-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteMilestoneTask(task.id); }}
                          className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add Task Button */}
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <button 
                  onClick={() => setIsNewTaskOpen(true)}
                  className="flex items-center gap-2 text-sm font-semibold text-[#D9291C] hover:text-[#B91C1C] hover:bg-red-50 w-full px-4 py-3 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add New Task
                </button>
              </div>

            </div>

            {/* Task Detail Sidebar */}
            {activeTask ? (
              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-neutral-100 self-start">
                <div className="flex items-center gap-3 mb-6">
                  {getTaskIcon(activeTask, milestoneTasks.findIndex(t => t.id === activeTask.id))}
                  <h3 className="text-lg font-bold text-[#1E293B] leading-tight">{activeTask.title}</h3>
                </div>
                
                {/* Simplified Due Date */}
                <div className="flex items-center gap-2 text-xs font-medium text-[#64748B] mb-6 border-b border-neutral-200 pb-6">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span>Target Date: <strong className="text-[#1E293B]">{activeTask.dueDate}</strong></span>
                </div>

                <div className="mb-6">
                  <span className="text-xs text-[#64748B]">Responsible: </span>
                  <span className="text-xs font-bold text-[#1E293B]">{activeTask.responsible}</span>
                </div>

                {/* Unified Checklist & Proponents */}
                <div>
                  <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-4">Checklist & Proponents</h4>
                  <div className="flex flex-col gap-2">
                    {activeTask.checklist.length === 0 ? (
                      <div className="text-xs text-[#94A3B8] italic mb-2">No checklist items yet.</div>
                    ) : (
                      activeTask.checklist.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 group relative py-2 bg-white px-3 rounded-xl border border-neutral-100 shadow-sm">
                          
                          <input 
                            type="checkbox" 
                            className="mt-1 rounded text-[#D9291C] cursor-pointer" 
                            checked={item.done}
                            onChange={() => toggleChecklistItem(activeTask.id, idx)}
                          />
                          
                          <div className="flex-1 flex flex-col gap-1.5">
                            <input 
                              type="text" 
                              value={item.text}
                              onChange={(e) => updateChecklistItem(activeTask.id, idx, 'text', e.target.value)}
                              placeholder="Describe the task part..."
                              className={`text-xs focus:outline-none focus:bg-neutral-50 focus:ring-1 focus:ring-neutral-200 focus:px-1 -ml-1 rounded transition-all placeholder:text-neutral-300 w-full ${item.done ? 'text-neutral-400 line-through decoration-neutral-300 font-medium' : 'text-[#1E293B] font-bold'}`}
                            />
                            
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`w-5 h-5 rounded-full ${item.ownerBgColor} ${item.ownerColor} font-bold text-[9px] flex items-center justify-center shrink-0`}>
                                {item.ownerInitials}
                              </div>
                              <input 
                                type="text" 
                                value={item.ownerName}
                                onChange={(e) => updateChecklistItem(activeTask.id, idx, 'ownerName', e.target.value)}
                                placeholder="Proponent name"
                                className="text-[10px] text-[#64748B] focus:outline-none focus:bg-neutral-50 focus:ring-1 focus:ring-neutral-200 focus:px-1 -ml-1 rounded transition-all placeholder:text-neutral-300 w-32"
                              />
                            </div>
                          </div>
                          
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center h-full absolute right-2 top-0">
                            <button 
                              onClick={() => removeChecklistItem(activeTask.id, idx)}
                              className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                    
                    <button 
                      onClick={() => addChecklistItem(activeTask.id)}
                      className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#D9291C] hover:text-[#B91C1C] hover:bg-red-50 w-fit px-2 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-neutral-100 flex flex-col items-center justify-center text-center h-[300px]">
                <p className="text-sm font-semibold text-[#64748B]">Select a task to view details</p>
                <p className="text-xs text-[#94A3B8] mt-2">Add a new task below to get started</p>
              </div>
            )}
          </div>
        </div>

      </div>
      
      <NewTaskModal isOpen={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} />
    </div>
  )
}
