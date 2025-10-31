# **Timeline/Gantt Chart App**

## **Description**
An interactive timeline / Gantt chart application built using **React** and **TypeScript**.  
Users can create, move, and resize tasks, track progress, and view dependencies.

---

## **Features**
- Drag & drop tasks across rows  
- Resize tasks (start & end dates)  
- Show task dependencies with arrows  
- Day, week, and month views  
- Milestone support (single-day tasks)  
- Sidebar/modal to view task details  
- Responsive design  

---

## **Tech Stack**
- **React.js + TypeScript**  
- **TailwindCSS** for styling  
- **DnD Kit** for drag & drop  
- **Storybook** for component documentation  
- **Vite** as the build tool  

---

## **Project Structure**
- `src/components/Timeline/` – Timeline components  
- `src/hooks/` – Custom hooks for drag & drop  
- `src/types/` – TypeScript types  
- `src/utils/` – Helper functions  
- `src/App.tsx` – Main entry and state management  

---

## **Setup Instructions**

### **1. Install dependencies**
```bash
npm install
This will install all required packages for the project.

2. Run the project in development mode

npm run dev
Open your browser at http://localhost:5173 to see the app running.

3. Run Storybook (optional)

npm run storybook
This opens Storybook, where you can preview and test individual components like TaskBar or TimelineGrid.

4. Build for production

npm run build
This will create a production-ready build in the dist/ folder.