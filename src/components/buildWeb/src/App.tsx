import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Select from './components/select-template/select'
import Template2 from './components/template/t2/src/main'
import Form from './components/form/src/main'
import EditTemp2 from './components/template/t2/edit/src/main'
import Templale1 from './components/template/t1/src/main'
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        
        <Routes>
          <Route path='/' element={<Select />} />
          <Route path='/template/t2' element={<Template2 />} />
          <Route path='/form' element={<Form />} />
          <Route path='/edit/template/t2' element={<EditTemp2 />} />  
          <Route path='/edit/template/t1' element={<Templale1 />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
