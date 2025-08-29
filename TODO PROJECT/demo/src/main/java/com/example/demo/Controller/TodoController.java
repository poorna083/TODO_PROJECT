package com.example.demo.Controller;

import com.example.demo.Model.Todo;
import com.example.demo.Repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired
    private TodoRepository todoRepository;

    @GetMapping
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    @GetMapping("/status/{completed}")
    public List<Todo> getByStatus(@PathVariable boolean completed) {
        return todoRepository.findByCompleted(completed);
    }

    @PostMapping
    public ResponseEntity<String> createTodo(@RequestBody Todo todo) {
        todoRepository.save(todo);
        return ResponseEntity.ok("Task added successfully!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        Optional<Todo> optionalTodo = todoRepository.findById(id);
        if (optionalTodo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Todo todo = optionalTodo.get();
        todo.setTitle(todoDetails.getTitle());
        todo.setCompleted(todoDetails.isCompleted());

        todoRepository.save(todo);
        return ResponseEntity.ok("Task updated successfully!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTodo(@PathVariable Long id) {
        if (!todoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        todoRepository.deleteById(id);
        return ResponseEntity.ok("Task deleted successfully!");
    }
}
