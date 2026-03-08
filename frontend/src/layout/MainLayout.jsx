import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      <div style={{ padding: "40px" }}>
        {children}
      </div>
    </>
  );
}

export default MainLayout;