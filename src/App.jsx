import { useState, useEffect } from 'react'
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from './services/studentService'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
  name: '',
  email: '',
  age: '',
  })

  useEffect(() => {
  async function loadStudents() {
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }

  loadStudents()
}, [])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

async function handleSubmit(event) {
  event.preventDefault()

  try {
    const student = {
      name: formData.name,
      email: formData.email,
      age: Number(formData.age),
    }

    if (editingId !== null) {
      const updatedStudent = await updateStudent(editingId, student)

      setStudents(
        students.map((s) =>
          s.id === editingId ? updatedStudent : s
        )
      )
    } else {
      const newStudent = await createStudent(student)

      setStudents([...students, newStudent])
    }

    setFormData({
      name: '',
      email: '',
      age: '',
    })

    setEditingId(null)
    setShowForm(false)
  } catch (error) {
    console.error('Error saving student:', error)
    alert('Failed to save student. Please check the backend.')
  }
}

function handleEdit(student) {
  setFormData({
    name: student.name,
    email: student.email,
    age: student.age
  })

  setEditingId(student.id)
  setShowForm(true)
}

async function handleDelete(id) {
  const confirmed = window.confirm(
    'Are you sure you want to delete this student?'
  )

  if (!confirmed) {
    return
  }

  try {
    await deleteStudent(id)

    setStudents(
      students.filter((student) => student.id !== id)
    )
  } catch (error) {
    console.error('Error deleting student:', error)
    alert('Failed to delete student. Please check the backend.')
  }
}

  return (
    <div className="app">
      <header className="header">
        <h1>Student Management System</h1>
        <p>Manage student records in one place</p>
      </header>

      <main className="main">
        <section className="dashboard">
          <div className="card">
            <h2>Total Students</h2>
            <p className="count">{students.length}</p>
          </div>

          <div className="card">
            <h2>Actions</h2>
            <button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Close Form' : 'Add Student'}
            </button>
          </div>
        </section>

        {showForm && (
          <section className="students form-section">
            <h2>{editingId !== null ? 'Edit Student' : 'Add Student'}</h2>

            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Student Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                name="age"
                type="number"
                min="1"
                max="120"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />
              <button type="submit">{editingId !== null ? 'Update Student' : 'Save Student'}</button>
            </form>
          </section>
        )}

        <section className="students">
          <h2>Students</h2>

          {students.length === 0 ? (
            <p>No students to display yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.age}</td>
                    <td><button onClick={() => handleEdit(student)}>Edit</button>
                    <button onClick={() => handleDelete(student.id)}className="delete-button">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
