<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WordPress Developer Portfolio</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <section id="home">
        <div class="intro">
            <h1>John Doe</h1>
            <p>Professional WordPress Developer</p>
        </div>
    </section>

    <section id="about">
        <h2>About Me</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </section>

    <section id="projects">
        <h2>Projects</h2>
        <div class="project-grid">
            <div class="project">
                <h3>Project 1</h3>
                <p>Short description of the project.</p>
            </div>
            <div class="project">
                <h3>Project 2</h3>
                <p>Short description of the project.</p>
            </div>
            <!-- Add more projects as needed -->
        </div>
    </section>

    <section id="contact">
        <h2>Contact Me</h2>
        <form id="contact-form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <label for="message">Message:</label>
            <textarea id="message" name="message" required></textarea>
            <button type="submit">Send Message</button>
        </form>
    </section>

    <footer>
        <p>&copy; 2024 John Doe. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
