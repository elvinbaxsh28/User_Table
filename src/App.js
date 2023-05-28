import PostList from "./components/PostList";
import NavBar from "./components/NavBar";
import { ThemeProvider } from "./components/ThemeContext";
function App() {
  return (
    <div className="App">
      <ThemeProvider>
      <NavBar/>
     <PostList/>
     </ThemeProvider>
    </div>
  );
}

export default App;
