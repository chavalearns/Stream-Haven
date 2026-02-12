// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    loadTheme();
    updateDashboard();
});

// THEME TOGGLE
function toggleTheme() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    showNotification(`Switched to ${isLight ? 'light' : 'dark'} mode`);
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
        document.body.classList.add('light');
    }
}

// STREAM PLANNER
function addStream() {
    const title = document.getElementById("streamTitle")?.value;
    const date = document.getElementById("streamDate")?.value;
    
    if (!title || !date) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    let streams = JSON.parse(localStorage.getItem("streams")) || [];
    streams.push({ 
        id: Date.now(),
        title, 
        date,
        completed: false
    });
    streams.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    localStorage.setItem("streams", JSON.stringify(streams));
    
    document.getElementById("streamTitle").value = '';
    document.getElementById("streamDate").value = '';
    
    displayStreams();
    showNotification('Stream added successfully!');
}

function deleteStream(id) {
    let streams = JSON.parse(localStorage.getItem("streams")) || [];
    streams = streams.filter(s => s.id !== id);
    localStorage.setItem("streams", JSON.stringify(streams));
    displayStreams();
    updateDashboard();
    showNotification('Stream deleted');
}

function toggleStreamComplete(id) {
    let streams = JSON.parse(localStorage.getItem("streams")) || [];
    const stream = streams.find(s => s.id === id);
    if (stream) {
        stream.completed = !stream.completed;
        localStorage.setItem("streams", JSON.stringify(streams));
        displayStreams();
        updateDashboard();
        showNotification(stream.completed ? 'Stream marked as completed!' : 'Stream marked as upcoming');
    }
}

function displayStreams() {
    const list = document.getElementById("streamList");
    if (!list) return;
    
    let streams = JSON.parse(localStorage.getItem("streams")) || [];
    
    if (streams.length === 0) {
        list.innerHTML = '<div class="empty-state">No streams scheduled yet. Add your first stream!</div>';
        return;
    }
    
    list.innerHTML = "";
    streams.forEach(s => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="item-text">
                <strong style="${s.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${s.title}</strong>
                <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
                    ${formatDate(s.date)}
                    <span class="badge ${s.completed ? 'completed' : 'upcoming'}">
                        ${s.completed ? 'Completed' : 'Upcoming'}
                    </span>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-small ${s.completed ? 'secondary' : 'success'}" onclick="toggleStreamComplete(${s.id})">
                    ${s.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="btn-small danger" onclick="deleteStream(${s.id})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// SIMS GOALS
function addGoal() {
    const goal = document.getElementById("simsGoal")?.value;
    if (!goal) {
        showNotification('Please enter a goal', 'error');
        return;
    }
    
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    goals.push({
        id: Date.now(),
        text: goal,
        completed: false,
        date: new Date().toISOString()
    });
    localStorage.setItem("goals", JSON.stringify(goals));
    
    document.getElementById("simsGoal").value = '';
    displayGoals();
    showNotification('Goal added!');
}

function deleteGoal(id) {
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    goals = goals.filter(g => g.id !== id);
    localStorage.setItem("goals", JSON.stringify(goals));
    displayGoals();
    showNotification('Goal deleted');
}

function toggleGoalComplete(id) {
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    const goal = goals.find(g => g.id === id);
    if (goal) {
        goal.completed = !goal.completed;
        localStorage.setItem("goals", JSON.stringify(goals));
        displayGoals();
        showNotification(goal.completed ? 'Goal completed! 👑' : 'Goal reopened');
    }
}

function displayGoals() {
    const list = document.getElementById("goalList");
    if (!list) return;
    
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    
    if (goals.length === 0) {
        list.innerHTML = '<div class="empty-state">No goals yet. Start adding your Oldenburg objectives!</div>';
        return;
    }
    
    list.innerHTML = "";
    goals.forEach(g => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="item-text">
                <span style="${g.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${g.text}</span>
                ${g.completed ? '<span class="badge completed">Completed</span>' : ''}
            </div>
            <div class="item-actions">
                <button class="btn-small ${g.completed ? 'secondary' : 'success'}" onclick="toggleGoalComplete(${g.id})">
                    ${g.completed ? 'Undo' : '✓'}
                </button>
                <button class="btn-small danger" onclick="deleteGoal(${g.id})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// IDEAS
function addIdea() {
    const idea = document.getElementById("ideaInput")?.value;
    if (!idea) {
        showNotification('Please enter an idea', 'error');
        return;
    }
    
    let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
    ideas.push({
        id: Date.now(),
        text: idea,
        date: new Date().toISOString(),
        used: false
    });
    localStorage.setItem("ideas", JSON.stringify(ideas));
    
    document.getElementById("ideaInput").value = '';
    displayIdeas();
    showNotification('Idea saved!');
}

function deleteIdea(id) {
    let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
    ideas = ideas.filter(i => i.id !== id);
    localStorage.setItem("ideas", JSON.stringify(ideas));
    displayIdeas();
    showNotification('Idea deleted');
}

function toggleIdeaUsed(id) {
    let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
    const idea = ideas.find(i => i.id === id);
    if (idea) {
        idea.used = !idea.used;
        localStorage.setItem("ideas", JSON.stringify(ideas));
        displayIdeas();
        showNotification(idea.used ? 'Idea marked as used!' : 'Idea marked as unused');
    }
}

function displayIdeas() {
    const list = document.getElementById("ideaList");
    if (!list) return;
    
    let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
    
    if (ideas.length === 0) {
        list.innerHTML = '<div class="empty-state">No ideas yet. Start brainstorming your next content!</div>';
        return;
    }
    
    list.innerHTML = "";
    ideas.forEach(i => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="item-text">
                <span style="${i.used ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${i.text}</span>
                ${i.used ? '<span class="badge completed">Used</span>' : ''}
            </div>
            <div class="item-actions">
                <button class="btn-small ${i.used ? 'secondary' : 'success'}" onclick="toggleIdeaUsed(${i.id})">
                    ${i.used ? 'Undo' : 'Used'}
                </button>
                <button class="btn-small danger" onclick="deleteIdea(${i.id})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// GROWTH TRACKER
function saveGrowth() {
    const twitch = document.getElementById("twitchInput")?.value;
    const youtube = document.getElementById("youtubeInput")?.value;
    const tiktok = document.getElementById("tiktokInput")?.value;
    
    if (!twitch && !youtube && !tiktok) {
        showNotification('Please enter at least one value', 'error');
        return;
    }
    
    // Get previous values for comparison
    const prevTwitch = parseInt(localStorage.getItem("twitch")) || 0;
    const prevYoutube = parseInt(localStorage.getItem("youtube")) || 0;
    const prevTiktok = parseInt(localStorage.getItem("tiktok")) || 0;
    
    // Save new values
    if (twitch) localStorage.setItem("twitch", twitch);
    if (youtube) localStorage.setItem("youtube", youtube);
    if (tiktok) localStorage.setItem("tiktok", tiktok);
    
    // Save to history for analytics
    let history = JSON.parse(localStorage.getItem("growthHistory")) || [];
    history.push({
        date: new Date().toISOString(),
        twitch: parseInt(twitch) || prevTwitch,
        youtube: parseInt(youtube) || prevYoutube,
        tiktok: parseInt(tiktok) || prevTiktok
    });
    // Keep only last 30 entries
    if (history.length > 30) history = history.slice(-30);
    localStorage.setItem("growthHistory", JSON.stringify(history));
    
    displayGrowthStats();
    showNotification('Growth stats saved!');
    
    // Clear inputs
    if (document.getElementById("twitchInput")) document.getElementById("twitchInput").value = '';
    if (document.getElementById("youtubeInput")) document.getElementById("youtubeInput").value = '';
    if (document.getElementById("tiktokInput")) document.getElementById("tiktokInput").value = '';
}

function displayGrowthStats() {
    const twitchEl = document.getElementById("twitchStat");
    const youtubeEl = document.getElementById("youtubeStat");
    const tiktokEl = document.getElementById("tiktokStat");
    
    if (twitchEl) twitchEl.textContent = localStorage.getItem("twitch") || "0";
    if (youtubeEl) youtubeEl.textContent = localStorage.getItem("youtube") || "0";
    if (tiktokEl) tiktokEl.textContent = localStorage.getItem("tiktok") || "0";
}

// DASHBOARD
function updateDashboard() {
    displayGrowthStats();
    updateTodayStream();
}

function updateTodayStream() {
    const todayEl = document.getElementById("todayStream");
    if (!todayEl) return;
    
    let streams = JSON.parse(localStorage.getItem("streams")) || [];
    const today = new Date();
    
    // Find next upcoming stream
    const upcomingStreams = streams
        .filter(s => !s.completed && new Date(s.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (upcomingStreams.length > 0) {
        const next = upcomingStreams[0];
        todayEl.innerHTML = `<strong>${next.title}</strong><br><small>${formatDate(next.date)}</small>`;
    } else {
        todayEl.textContent = "No upcoming streams scheduled.";
    }
}

// Initialize displays
displayStreams();
displayGoals();
displayIdeas();
displayGrowthStats();