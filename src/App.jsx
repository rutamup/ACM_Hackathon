import { useCallback, useEffect, useMemo, useState } from "react";
import { daysUntil, parseLocalDate } from "./utils/dates";

/* ─── Constants ─────────────────────────────────────────────────────── */
const EMPTY_SUGGESTION = {
  difficulty: "Medium",
  focusMinutes: 25,
  sessions: 2,
<<<<<<< HEAD
  breakMinutes: 15,
  reason: "Plan generated from your task details.",
=======
  breakMinutes: 5,
>>>>>>> 8398810 (my local changes)
};

const FOCUS_QUOTES = [
  "Small wins compound into serious momentum.",
  "The best work is built one focused block at a time.",
  "Progress gets easier when you protect your attention.",
  "You showed up, stayed with it, and moved the task forward.",
];

const STEPS = ["Task", "Plan", "Adjust", "Timer", "Done"];
const STEP_MAP = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 3, 6: 4 };

const RING_R = 88;
const RING_C = 2 * Math.PI * RING_R; // circumference

/* ─── Helpers ───────────────────────────────────────────────────────── */
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

<<<<<<< HEAD
function getDeadlineDateTime(deadline, deadlineTime) {
  const date = parseLocalDate(deadline);
  const [hours, minutes] = deadlineTime.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function getTaskSuggestion(name, description, difficulty, deadline) {
  const text = `${name} ${description}`.toLowerCase();
  const hardWords = ["build", "project", "exam", "research", "design", "code"];
  const needsExtraSession = hardWords.some((word) => text.includes(word));
=======
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getTaskSuggestion(name, description) {
  const text = `${name} ${description}`.toLowerCase();
  const hardWords = ["build", "project", "exam", "research", "design", "code"];
  const easyWords = ["read", "reply", "email", "review", "clean", "call"];
  const isHard = hardWords.some((w) => text.includes(w));
  const isEasy = easyWords.some((w) => text.includes(w));
>>>>>>> 8398810 (my local changes)
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const daysLeft = daysUntil(deadline);
  const urgencyBoost = daysLeft <= 1 ? 1 : daysLeft <= 3 ? 0 : -1;
  const complexityBoost = needsExtraSession || wordCount > 16 ? 1 : 0;

<<<<<<< HEAD
  if (difficulty === "Hard") {
    return {
      difficulty,
      focusMinutes: 50,
      sessions: Math.max(2, Math.min(5, 3 + urgencyBoost + complexityBoost)),
      breakMinutes: 15,
    };
  }

  if (difficulty === "Easy") {
    return {
      difficulty,
      focusMinutes: 25,
      sessions: Math.max(1, Math.min(3, 1 + urgencyBoost + complexityBoost)),
      breakMinutes: 10,
    };
  }

  return {
    difficulty,
    focusMinutes: 35,
    sessions: Math.max(1, Math.min(4, 2 + urgencyBoost + complexityBoost)),
    breakMinutes: 15,
  };
}

function getTodayInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
=======
  if (isHard || wordCount > 16) {
    return { difficulty: "Hard", focusMinutes: 50, sessions: 3, breakMinutes: 5 };
  }
  if (isEasy || wordCount < 7) {
    return { difficulty: "Easy", focusMinutes: 25, sessions: 1, breakMinutes: 5 };
  }
  return EMPTY_SUGGESTION;
>>>>>>> 8398810 (my local changes)
}

function playCompletionChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
    [660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.16);
      osc.connect(gain);
      osc.start(ctx.currentTime + i * 0.16);
      osc.stop(ctx.currentTime + i * 0.16 + 0.22);
    });
    window.setTimeout(() => ctx.close(), 900);
  } catch {
    // Audio blocked — visual notification still works.
  }
}

/* ─── Step indicator component ──────────────────────────────────────── */
function StepIndicator({ workflowStep }) {
  const activeIdx = STEP_MAP[workflowStep] ?? 0;
  return (
    <nav className="step-indicator" aria-label="Progress steps">
      {STEPS.map((label, i) => {
        const isDone = i < activeIdx;
        const isActive = i === activeIdx;
        return (
          <div key={label} className="step-item">
            <div className={`step-dot ${isDone ? "done" : isActive ? "active" : ""}`}>
              {isDone ? "✓" : i + 1}
            </div>
            <span className={`step-label ${isDone ? "done" : isActive ? "active" : ""}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`step-line ${isDone ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ─── Main App ──────────────────────────────────────────────────────── */
function App() {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDifficulty, setTaskDifficulty] = useState("Medium");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskDeadlineTime, setTaskDeadlineTime] = useState("");
  const [suggestion, setSuggestion] = useState(EMPTY_SUGGESTION);
  const [hasSuggestion, setHasSuggestion] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [totalTimerSeconds, setTotalTimerSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("focus");
  const [remainingSessions, setRemainingSessions] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [workflowStep, setWorkflowStep] = useState(1);
  const [sessionNotice, setSessionNotice] = useState(null);
<<<<<<< HEAD
  const [isSuggesting, setIsSuggesting] = useState(false);
  const todayInputValue = getTodayInputValue();
=======
  // tracks whether the current break is a post-task break (go to dashboard when done)
  const [isPostTaskBreak, setIsPostTaskBreak] = useState(false);
>>>>>>> 8398810 (my local changes)

  /* Derived stats */
  const totalFocusMinutes = useMemo(
    () => completedTasks.reduce((sum, t) => sum + t.focusMinutes * t.sessions, 0),
    [completedTasks]
  );

  /* Timer ring progress (1.0 → 0.0 as timer counts down) */
  const timerProgress = totalTimerSeconds > 0 ? timerSeconds / totalTimerSeconds : 0;
  const ringOffset = RING_C * (1 - timerProgress);

  /* ── completeTimerSegment ─────────────────────────────────────────── */
  const completeTimerSegment = useCallback(() => {
    if (!activeTask) return;
    setIsRunning(false);

    if (mode === "focus") {
      const nextSessions = remainingSessions - 1;
      const quote = FOCUS_QUOTES[
        (completedTasks.length + remainingSessions) % FOCUS_QUOTES.length
      ];
      playCompletionChime();

      if (nextSessions <= 0) {
        // Task done — save it, then start a 5-min post-task break
        setCompletedTasks((prev) => [
          { ...activeTask, completedAt: new Date().toISOString() },
          ...prev,
        ]);
        setSessionNotice({
          title: "Task complete!",
          message: `Great work. You completed "${activeTask.name}".`,
          quote,
        });
        setStatusMessage("Task complete! Enjoy your 5-minute break.");
        setIsPostTaskBreak(true);
        setMode("break");
        const breakSecs = 5 * 60;
        setTimerSeconds(breakSecs);
        setTotalTimerSeconds(breakSecs);
        setRemainingSessions(0);
        setWorkflowStep(5);
        return;
      }

      setSessionNotice({
        title: "Session complete!",
        message: `Great work on "${activeTask.name}". Your break starts automatically.`,
        quote,
      });
      setStatusMessage("Focus session complete. Break timer started automatically.");
      setRemainingSessions(nextSessions);
      setMode("break");
      const interBreakSecs = activeTask.breakMinutes * 60;
      setTimerSeconds(interBreakSecs);
      setTotalTimerSeconds(interBreakSecs);
      setIsRunning(true);
      setWorkflowStep(5);
      return;
    }



    function handleStart() {
      const name = taskName.trim();
      if (!name) return;
      const task = {
        id: crypto.randomUUID(),
        name,
        description: taskDescription.trim(),
        deadline: taskDeadline,
        deadlineTime: taskDeadlineTime,
        ...suggestion,
      };
      const focusSecs = task.focusMinutes * 60;
      setActiveTask(task);
      setRemainingSessions(task.sessions);
      setMode("focus");
      setTimerSeconds(focusSecs);
      setTotalTimerSeconds(focusSecs);
      setIsRunning(false);
      setIsPostTaskBreak(false);
      setStatusMessage("Focus timer ready. Hit Start when you are.");
      setWorkflowStep(4);
      setTaskName("");
      setTaskDescription("");
      setTaskDifficulty("Medium");
      setTaskDeadline("");
      setTaskDeadlineTime("");
      setHasSuggestion(false);
      setSuggestion(EMPTY_SUGGESTION);
    }

    function handleStopTask() {
      setActiveTask(null);
      setIsRunning(false);
      setTimerSeconds(0);
      setTotalTimerSeconds(0);
      setMode("focus");
      setRemainingSessions(0);
      setIsPostTaskBreak(false);
      setStatusMessage("Timer stopped.");
      setWorkflowStep(1);
    }

    function handleStartBreak() {
      if (!activeTask) return;
      const breakSecs = 5 * 60;
      setMode("break");
      setTimerSeconds(breakSecs);
      setTotalTimerSeconds(breakSecs);
      setIsRunning(true);
      setIsPostTaskBreak(false);
      setStatusMessage("5-minute break started.");
      setWorkflowStep(5);
    }

    function updateSuggestion(key, value) {
      setSuggestion((cur) => ({
        ...cur,
        [key]: key === "difficulty" ? value : Number(value),
      }));
    }

    function handleNewTask() {
      setActiveTask(null);
      setIsRunning(false);
      setTimerSeconds(0);
      setTotalTimerSeconds(0);
      setMode("focus");
      setRemainingSessions(0);
      setIsPostTaskBreak(false);
      setStatusMessage("");
      setWorkflowStep(1);
    }

    function handleViewDashboard() {
      setWorkflowStep(6);
    }

    // Called when user clicks "Start Break" / "Continue Break" on the notice modal
    function handleDismissNotice() {
      setSessionNotice(null);
      if (isPostTaskBreak) {
        setIsRunning(true);
      }
    }

    /* ── Render ───────────────────────────────────────────────────────── */
    return (
      <main className="app-shell">

        {/* Hero */}
        <section className="hero-panel">
          <div>
            <p className="eyebrow">FocusFlow</p>
            <h1>Plan the task, tune the session, start the timer.</h1>
            <div className="hero-actions">
              <button id="btn-view-dashboard" onClick={handleViewDashboard}>
                View Dashboard
              </button>
              {activeTask && (
                <button
                  id="btn-back-to-timer"
                  className="primary-action"
                  onClick={() => setWorkflowStep(mode === "break" ? 5 : 4)}
                >
                  Back To Timer
                </button>
              )}
            </div>
          </div>
          <div className="hero-stats" aria-label="Session summary">
            <span>{completedTasks.length}</span>
            <p>tasks done</p>
            <span>{totalFocusMinutes}</span>
            <p>focus minutes</p>
          </div>
        </section>

        {/* Step indicator */}
        <StepIndicator workflowStep={workflowStep} />

        {/* Workflow panels */}
        <section className="stage-shell">

          {/* Step 1 — Enter Task */}
          {workflowStep === 1 && (
            <div className="panel task-panel stage-panel">
              <div className="panel-heading">
                <div>
                  <h2>Enter Task</h2>
                  <p>Type what you need to do and add any useful context.</p>
                </div>
              </div>

<<<<<<< HEAD
          <label>
            Task name
            <input
              type="text"
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
              placeholder="Prepare database notes"
            />
          </label>

          <label>
            Description
            <textarea
              value={taskDescription}
              onChange={(event) => setTaskDescription(event.target.value)}
              placeholder="Add chapter, deadline, difficulty, or goal details"
              rows="4"
            />
          </label>

          <div className="control-grid">
            <label>
              Difficulty
              <select
                value={taskDifficulty}
                onChange={(event) => setTaskDifficulty(event.target.value)}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>

            <label>
              Deadline
              <input
                type="date"
                min={todayInputValue}
                value={taskDeadline}
                onChange={(event) => setTaskDeadline(event.target.value)}
              />
            </label>

            <label>
              Deadline time
              <input
                type="time"
                value={taskDeadlineTime}
                onChange={(event) => setTaskDeadlineTime(event.target.value)}
              />
            </label>
          </div>

    { statusMessage && <p className="status-line">{statusMessage}</p> }

    <button className="primary-action" onClick={handleSuggest}>
      {isSuggesting ? "Generating..." : "Get Suggestion"}
    </button>
        </div >
        )
}

{
  workflowStep === 2 && (
    <div className="panel suggestion-panel stage-panel">
      <div className="panel-heading">
        <div>
          <h2>AI Suggests</h2>
          <p>Structured plan generated from your task details.</p>
        </div>
      </div>

      <div className="plan-card">
        <div>
          <span>Plan</span>
          <strong>
            {suggestion.sessions} focus session
            {suggestion.sessions === 1 ? "" : "s"} for a{" "}
            {suggestion.difficulty.toLowerCase()} task
          </strong>
        </div>
        <ul>
          <li>Total workload: {suggestion.sessions} sessions</li>
          <li>
            Focus rhythm: {suggestion.focusMinutes} min work +{" "}
            {suggestion.breakMinutes} min break
          </li>
          <li>
            Recommendation:{" "}
            {suggestion.difficulty === "Hard"
              ? "start this while your energy is highest"
              : suggestion.difficulty === "Easy"
                ? "complete this quickly before deeper work"
                : "keep it steady and avoid switching tasks"}
          </li>
          <li>
            Deadline pressure:{" "}
            {daysUntil(taskDeadline) <= 1
              ? "urgent"
              : daysUntil(taskDeadline) <= 3
                ? "soon"
                : "flexible"}
          </li>
          <li>Reason: {suggestion.reason}</li>
        </ul>
      </div>

      <div className="suggestion-grid">
        <div>
          <span>Difficulty</span>
          <strong>{suggestion.difficulty}</strong>
        </div>
        <div>
          <span>Focus</span>
          <strong>{suggestion.focusMinutes} min</strong>
        </div>
        <div>
          <span>Sessions</span>
          <strong>{suggestion.sessions}</strong>
        </div>
        <div>
          <span>Deadline</span>
          <strong>
            {taskDeadline} at {taskDeadlineTime}
          </strong>
        </div>
        <div>
          <span>Break</span>
          <strong>{suggestion.breakMinutes} min</strong>
        </div>
      </div>

      <div className="stage-actions">
        <button onClick={() => setWorkflowStep(1)}>Edit Task</button>
        <button className="primary-action" onClick={() => setWorkflowStep(3)}>
          Adjust Plan
        </button>
      </div>
    </div>
  )
}

{
  workflowStep === 3 && (
    <div className="panel adjust-panel stage-panel">
      <div className="panel-heading">
        <div>
          <h2>User Adjusts</h2>
          <p>Change the plan before starting.</p>
        </div>
      </div>

      <div className="control-grid">
        <label>
          Difficulty
          <select
            value={suggestion.difficulty}
            onChange={(event) =>
              updateSuggestion("difficulty", event.target.value)
            }
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>

        <label>
          Focus minutes
=======
            <label htmlFor="input-task-name">
            Task name
>>>>>>> 8398810 (my local changes)
            <input
              id="input-task-name"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSuggest()}
              placeholder="Prepare database notes"
              autoFocus
            />
          </label>

          <label htmlFor="input-task-description">
            Description (optional)
            <textarea
              id="input-task-description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Add chapter, deadline, difficulty, or goal details"
              rows={4}
            />
          </label>

          {statusMessage && <p className="status-line">{statusMessage}</p>}

          <button
            id="btn-get-suggestion"
            className="primary-action"
            onClick={handleSuggest}
          >
            Get AI Suggestion →
          </button>
      </div>
        )}

      {/* Step 2 — AI Suggests */}
      {workflowStep === 2 && (
        <div className="panel suggestion-panel stage-panel">
          <div className="panel-heading">
            <div>
              <h2>AI Suggests</h2>
              <p>Structured plan generated from your task details.</p>
            </div>
          </div>

          <div className="plan-card">
            <div>
              <span>Recommended Plan</span>
              <strong>
                {suggestion.sessions} focus session{suggestion.sessions === 1 ? "" : "s"}{" "}
                for a {suggestion.difficulty.toLowerCase()} task
              </strong>
            </div>
            <ul>
              <li>Total workload: {suggestion.sessions} session{suggestion.sessions === 1 ? "" : "s"}</li>
              <li>
                Focus rhythm: {suggestion.focusMinutes} min work + {suggestion.breakMinutes} min break
              </li>
              <li>
                Tip:{" "}
                {suggestion.difficulty === "Hard"
                  ? "Start while your energy is highest."
                  : suggestion.difficulty === "Easy"
                    ? "Clear this quickly before deeper work."
                    : "Keep it steady and avoid task-switching."}
              </li>
            </ul>
          </div>

          <div className="suggestion-grid">
            <div><span>Difficulty</span><strong>{suggestion.difficulty}</strong></div>
            <div><span>Focus</span><strong>{suggestion.focusMinutes} min</strong></div>
            <div><span>Sessions</span><strong>{suggestion.sessions}</strong></div>
            <div><span>Break</span><strong>{suggestion.breakMinutes} min</strong></div>
          </div>

          <div className="stage-actions">
            <button id="btn-edit-task" onClick={() => setWorkflowStep(1)}>
              ← Edit Task
            </button>
            <button
              id="btn-adjust-plan"
              className="primary-action"
              onClick={() => setWorkflowStep(3)}
            >
              Adjust Plan →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — User Adjusts */}
      {workflowStep === 3 && (
        <div className="panel adjust-panel stage-panel">
          <div className="panel-heading">
            <div>
              <h2>Adjust Plan</h2>
              <p>Fine-tune the suggestion before you start.</p>
            </div>
          </div>

          <div className="control-grid">
            <label htmlFor="select-difficulty">
              Difficulty
              <select
                id="select-difficulty"
                value={suggestion.difficulty}
                onChange={(e) => updateSuggestion("difficulty", e.target.value)}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>

            <label htmlFor="input-focus-minutes">
              Focus minutes
              <input
                id="input-focus-minutes"
                type="number"
                min={5}
                max={90}
                value={suggestion.focusMinutes}
                onChange={(e) => updateSuggestion("focusMinutes", e.target.value)}
              />
            </label>

            <label htmlFor="input-sessions">
              Sessions
              <input
                id="input-sessions"
                type="number"
                min={1}
                max={8}
                value={suggestion.sessions}
                onChange={(e) => updateSuggestion("sessions", e.target.value)}
              />
            </label>

            <label htmlFor="input-break-minutes">
              Break minutes
              <input
                id="input-break-minutes"
                type="number"
                min={1}
                max={45}
                value={suggestion.breakMinutes}
                onChange={(e) => updateSuggestion("breakMinutes", e.target.value)}
              />
            </label>
          </div>

          <div className="stage-actions">
            <button id="btn-back-to-suggest" onClick={() => setWorkflowStep(2)}>
              ← Back
            </button>
            <button
              id="btn-confirm-start"
              className="primary-action"
              onClick={handleStart}
              disabled={!hasSuggestion && !taskName.trim()}
            >
              Confirm &amp; Start →
            </button>
          </div>
        </div>
      )}

      {/* Step 4 / 5 — Timer */}
      {(workflowStep === 4 || workflowStep === 5) && (
        <div className="panel timer-panel stage-panel">
          <div className="panel-heading">
            <div>
              <h2>{mode === "break" ? "☕ Break Timer" : "🎯 Focus Timer"}</h2>
              <p>
                {activeTask
                  ? activeTask.name
                  : "Start a task to activate the countdown."}
              </p>
            </div>
          </div>

          {/* Circular ring timer */}
          <div className={`timer-display ${mode}`}>
            <div className="timer-ring-container">
              <svg
                className="timer-ring"
                viewBox="0 0 200 200"
                aria-hidden="true"
              >
                <circle cx="100" cy="100" r={RING_R} className="ring-track" />
                <circle
                  cx="100"
                  cy="100"
                  r={RING_R}
                  className={`ring-progress ${isRunning ? "running" : ""}`}
                  style={{
                    strokeDasharray: RING_C,
                    strokeDashoffset: ringOffset,
                  }}
                />
              </svg>
              <div className="timer-text">
                <span className={isRunning ? "running" : ""}>
                  {formatTime(timerSeconds)}
                </span>
                <p>
                  {activeTask
                    ? `${remainingSessions} session${remainingSessions === 1 ? "" : "s"} left`
                    : "No active task"}
                </p>
              </div>
            </div>
          </div>

          <div className="timer-actions">
            <button
              id="btn-timer-start"
              className="primary-action"
              onClick={() => setIsRunning(true)}
              disabled={!activeTask || isRunning || timerSeconds === 0}
            >
              Start
            </button>
            <button
              id="btn-timer-pause"
              onClick={() => setIsRunning(false)}
              disabled={!isRunning}
            >
              Pause
            </button>
            <button
              id="btn-timer-stop"
              onClick={handleStopTask}
              disabled={!activeTask}
            >
              Stop
            </button>
            <button
              id="btn-timer-break"
              onClick={handleStartBreak}
              disabled={!activeTask || isRunning || mode === "break"}
            >
              5-min Break
            </button>
          </div>

          {statusMessage && (
            <p className="status-line" role="status" aria-live="polite">
              {statusMessage}
            </p>
          )}
        </div>
      )}

      {/* Step 6 — Dashboard */}
      {workflowStep === 6 && (
        <div className="panel dashboard-panel stage-panel">
          <div className="panel-heading">
            <div>
              <h2>📊 Dashboard</h2>
              <p>Your productivity summary and a focus tip.</p>
            </div>
          </div>

          <div className="dashboard-metrics">
            <div>
              <span>Tasks done</span>
              <strong>{completedTasks.length}</strong>
            </div>
            <div>
              <span>Focus minutes</span>
              <strong>{totalFocusMinutes}</strong>
            </div>
            <div>
              <span>Avg. per task</span>
              <strong>
                {completedTasks.length
                  ? Math.round(totalFocusMinutes / completedTasks.length)
                  : 0}
              </strong>
            </div>
          </div>

          <div className="tip-box">
            💡 Start hard tasks while your energy is highest, then use breaks to
            reset before the next session.
          </div>

          <div className="task-history">
            {completedTasks.length === 0 ? (
              <p className="task-history-empty">
                No completed tasks yet — finish a session to see it here.
              </p>
            ) : (
              completedTasks.slice(0, 5).map((task) => (
                <article key={task.id}>
                  <div>
                    <strong>{task.name}</strong>
                    {task.completedAt && (
                      <span className="task-history-date">
                        Completed at {formatDate(task.completedAt)}
                      </span>
                    )}
                  </div>
                  <span>
                    {task.sessions} × {task.focusMinutes} min
                  </span>
                </article>
              ))
            )}
          </div>

          <div className="stage-actions">
            {activeTask && (
              <button
                id="btn-back-to-timer-dash"
                onClick={() => setWorkflowStep(mode === "break" ? 5 : 4)}
              >
                Back To Timer
              </button>
            )}
            <button
              id="btn-plan-next-task"
              className="primary-action"
              onClick={handleNewTask}
            >
              Plan Next Task →
            </button>
          </div>
        </div>
      )}
    </section>

      {/* Session / task-complete notice */ }
  {
    sessionNotice && (
      <div
        className="notice-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-title"
      >
        <div className="notice-card">
          <p className="eyebrow">Congratulations</p>
          <h2 id="notice-title">{sessionNotice.title}</h2>
          <p>{sessionNotice.message}</p>
          <blockquote>{sessionNotice.quote}</blockquote>
          <button
            id="btn-dismiss-notice"
            className="primary-action"
            onClick={handleDismissNotice}
          >
            {isPostTaskBreak ? "Start 5-min Break" : "Continue Break"}
          </button>
        </div>
      </div>
    )
  }
    </main >
  );
}

export default App;
