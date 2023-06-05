// import PostList from "./components/PostList";
import NavBar from "./components/NavBar";
import { ThemeProvider } from "./components/ThemeContext";
// import DataViewer from "./components/DataViewer";
import AppData from "./components/AppData";
function App() {
  return (
    <div className="App">
      <ThemeProvider>
      <NavBar/>
     {/* <PostList/> */}
     {/* <DataViewer/> */}
     <AppData/>
     </ThemeProvider>
     
    </div>
  );
}

export default App;
