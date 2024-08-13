<h1 align="center"><strong>ListAI</strong></h1>

<h2 align="center"><strong>Description</strong></h2>

<p align="justify">This project is the frontend of a system that facilitates the creation of playlists on Spotify through spoken language. It connects to a backend that converts the spoken request into text and recommends a series of songs based on the user's input. Subsequently, it interacts with the Spotify API to create the playlist with the recommended tracks, adding a brief description and a title that aligns with the user's request.</p>

<h2 align="center"><strong>Features</strong></h2>

<ul>
  <li><strong>React with TypeScript:</strong> Leverages the power of TypeScript for type safety and enhanced development experience.</li>
  <li><strong>Vite:</strong> Utilizes Vite for fast builds and optimized production bundles.</li>
  <li><strong>Three.js Integration:</strong> Includes 3D graphics rendering using Three.js with React bindings through @react-three/fiber.</li>
  <li><strong>State Management:</strong> Manages application state efficiently using React hooks.</li>
  <li><strong>API Integration:</strong> Uses axios for handling HTTP requests and qs for query string manipulation.</li>
  <li><strong>Advanced Animations:</strong> Implements animations with mo-js and @mojs/core.</li>
  <li><strong>Styled Components:</strong> Uses modern CSS with sass for styling.</li>
</ul>

<h2 align="center"><strong>Getting Started</strong></h2>

<h3><strong>Prerequisites</strong></h3>

<ul>
  <li>Node.js (v14 or higher)</li>
  <li>npm or yarn</li>
</ul>

<h3><strong>Installation</strong></h3>

<p>1. Clone the repository:</p>

<pre><code>git clone https://github.com/JavierEspinosaP/frontend_listAI.git
cd frontend_listAI
</code></pre>

<p>2. Install dependencies:</p>

<pre><code>npm install
</code></pre>

<p>or</p>

<pre><code>yarn install
</code></pre>

<h3><strong>Running the Application</strong></h3>

<p>To start the development server:</p>

<pre><code>npm run dev
</code></pre>

<p>This will run the application in development mode. Open http://localhost:3000 to view it in the browser.</p>

<h3><strong>Building for Production</strong></h3>

<p>To create a production build:</p>

<pre><code>npm run build
</code></pre>

<p>The production-ready files will be located in the dist directory.</p>

<h3><strong>Linting</strong></h3>

<p>To lint the project files:</p>

<pre><code>npm run lint
</code></pre>

<p>This will check the code for any linting errors based on the configuration in the project.</p>

<h2 align="center"><strong>Project Structure</strong></h2>

<ul>
  <li><strong>/src:</strong> Contains the source code of the application.</li>
  <ul>
    <li><strong>/components:</strong> Reusable UI components.</li>
    <li><strong>/assets:</strong> Static assets such as images, fonts, etc.</li>
    <li><strong>/styles:</strong> Global and component-specific stylesheets.</li>
    <li><strong>App.tsx:</strong> The root component of the application.</li>
    <li><strong>main.tsx:</strong> Entry point for the React application.</li>
  </ul>
  <li><strong>/public:</strong> Static files and assets.</li>
  <li><strong>/dist:</strong> Output directory for the production build.</li>
  <li><strong>package.json:</strong> Project metadata and scripts.</li>
</ul>

<h2 align="center"><strong>Dependencies</strong></h2>

<ul>
  <li><strong>react:</strong> ^18.2.0</li>
  <li><strong>react-dom:</strong> ^18.2.0</li>
  <li><strong>axios:</strong> ^1.6.7</li>
  <li><strong>crypto-js:</strong> ^4.2.0</li>
  <li><strong>js-cookie:</strong> ^3.0.5</li>
  <li><strong>@react-three/fiber:</strong> ^8.15.19</li>
  <li><strong>@react-three/drei:</strong> ^9.99.7</li>
  <li><strong>mo-js:</strong> ^0.288.2</li>
  <li><strong>sass:</strong> ^1.71.1</li>
  <li><strong>tsparticles:</strong> ^3.3.0</li>
</ul>

<h2 align="center"><strong>Dev Dependencies</strong></h2>

<ul>
  <li><strong>typescript:</strong> ^5.2.2</li>
  <li><strong>vite:</strong> ^5.0.8</li>
  <li><strong>eslint:</strong> ^8.55.0</li>
  <li><strong>@typescript-eslint/eslint-plugin:</strong> ^6.14.0</li>
  <li><strong>@typescript-eslint/parser:</strong> ^6.14.0</li>
</ul>

<h2 align="center"><strong>License</strong></h2>

<p>This project is licensed under the MIT License - see the LICENSE file for details.</p>
