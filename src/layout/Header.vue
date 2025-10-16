
<template>
    <header class="top-header">
        <div class="left-header">
            <i class="fas fa-th app-menu-icon"></i>
            <span class="app-header-name">Tuyển dụng</span>
            <div class="search-bar">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Tìm kiếm tin tuyển dụng, ứng viên, nhân tài...">
            </div>
        </div>

        <div class="header-icons">
            <i class="fas fa-globe"></i>
            <span>Website tuyển dụng</span>
            <i class="fas fa-bell notification"></i>
            <i class="fas fa-comment-dots notification"></i>
            <i class="fas fa-question-circle"></i>
        </div>
    </header>
</template>
<!-- <style>
@import "../assets/css/styles.css";
</style> -->
<style scoped>

.top-header .app-menu-icon {
    font-size: 22px;
    color: var(--light-text-color);
    margin-right: 15px;
    cursor: pointer;
}

.top-header .app-header-name {
    font-size: 18px;
    font-weight: bold;
    color: var(--text-color);
    margin-right: 15px; 
}

.top-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--top-header-bg);
    padding: 10px 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    margin-bottom: 0; 
    position: fixed;
    top: 0;
    left: 0; 
    width: 100%; 
    height: var(--header-height);
    z-index: 1000;
}

.top-header.sidebar-collapsed {
    width: 100%;
    left: 0;
}


.top-header .search-bar {
    display: flex;
    align-items: center;
    background-color: var(--main-bg); 
    border: 1px solid var(--border-color); 
    padding: 8px 10px; 
    flex-grow: 1;
    max-width: 400px; 
    margin: 0 10px;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); 
}

.top-header .search-bar i {
    color: var(--light-text-color);
    margin-right: 10px;
}

.top-header .search-bar input {
    border: none;
    background: transparent;
    outline: none;
    flex-grow: 1;
    font-size: 10px;
    color: var(--text-color);
}

.top-header .header-icons {
    display: flex;
}

.top-header .header-icons i,
.top-header .header-icons span {
    margin-left: 10px; 
    color: var(--light-text-color);
    cursor: pointer;
    position: relative;
}

.left-header {
    display: flex;
    flex-grow: 2; 
}
</style>