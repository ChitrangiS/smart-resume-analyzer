// Sample skills dataset for different job roles
const skillsDataset = {
  frontend: {
    title: "Frontend Developer",
    coreSkills: [
      "html", "css", "javascript", "typescript", "react", "vue", "angular",
      "redux", "webpack", "babel", "sass", "less", "tailwind", "bootstrap",
      "responsive design", "rest api", "graphql", "jest", "cypress",
      "accessibility", "performance optimization", "git", "npm", "yarn"
    ],
    advancedSkills: [
      "next.js", "nuxt", "svelte", "web components", "pwa",
      "web assembly", "three.js", "d3.js", "storybook", "figma",
      "microfrontends", "module federation", "vite", "turbopack"
    ],
    softSkills: [
      "ui/ux", "design systems", "cross-browser compatibility",
      "code review", "agile", "scrum", "problem solving", "communication"
    ]
  },
  backend: {
    title: "Backend Developer",
    coreSkills: [
      "node.js", "python", "java", "go", "ruby", "php", "express",
      "django", "flask", "spring", "rest api", "graphql", "sql",
      "postgresql", "mysql", "mongodb", "redis", "docker", "kubernetes",
      "aws", "git", "linux", "microservices", "authentication", "jwt"
    ],
    advancedSkills: [
      "kafka", "rabbitmq", "grpc", "elasticsearch", "nginx",
      "terraform", "ci/cd", "jenkins", "github actions", "serverless",
      "websockets", "caching", "load balancing", "database optimization"
    ],
    softSkills: [
      "system design", "api design", "security", "scalability",
      "code review", "agile", "scrum", "problem solving", "documentation"
    ]
  },
  datascience: {
    title: "Data Scientist",
    coreSkills: [
      "python", "r", "sql", "machine learning", "deep learning",
      "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
      "matplotlib", "seaborn", "statistics", "data analysis",
      "feature engineering", "model evaluation", "jupyter", "git",
      "data visualization", "hypothesis testing", "regression", "classification"
    ],
    advancedSkills: [
      "nlp", "computer vision", "reinforcement learning", "time series",
      "spark", "hadoop", "airflow", "mlflow", "kubeflow", "docker",
      "aws sagemaker", "gcp vertex ai", "azure ml", "transformers",
      "llm", "rag", "a/b testing", "bayesian statistics"
    ],
    softSkills: [
      "storytelling", "business acumen", "communication", "critical thinking",
      "research", "problem solving", "stakeholder management", "presentation"
    ]
  },
  devops: {
    title: "DevOps Engineer",
    coreSkills: [
      "docker", "kubernetes", "aws", "gcp", "azure", "linux", "bash",
      "python", "terraform", "ansible", "jenkins", "github actions",
      "gitlab ci", "prometheus", "grafana", "nginx", "git",
      "ci/cd", "infrastructure as code", "monitoring", "logging"
    ],
    advancedSkills: [
      "helm", "istio", "service mesh", "vault", "consul",
      "elk stack", "datadog", "splunk", "cloudformation", "pulumi",
      "chaos engineering", "site reliability", "sre", "argocd", "flux"
    ],
    softSkills: [
      "system design", "security", "incident management", "documentation",
      "collaboration", "problem solving", "communication", "agile"
    ]
  },
  fullstack: {
    title: "Full Stack Developer",
    coreSkills: [
      "html", "css", "javascript", "typescript", "react", "node.js",
      "express", "sql", "mongodb", "rest api", "git", "docker",
      "aws", "postgresql", "redis", "graphql", "jest", "webpack",
      "linux", "authentication", "jwt", "responsive design"
    ],
    advancedSkills: [
      "next.js", "nuxt", "microservices", "kubernetes", "ci/cd",
      "websockets", "serverless", "pwa", "graphql", "terraform",
      "system design", "performance optimization", "security"
    ],
    softSkills: [
      "agile", "scrum", "code review", "problem solving",
      "communication", "documentation", "ui/ux", "api design"
    ]
  },
  mobile: {
    title: "Mobile Developer",
    coreSkills: [
      "react native", "flutter", "swift", "kotlin", "android", "ios",
      "javascript", "dart", "xcode", "android studio", "rest api",
      "git", "push notifications", "app store", "google play",
      "ui design", "mobile ux", "firebase", "sqlite"
    ],
    advancedSkills: [
      "ar/vr", "bluetooth", "nfc", "biometrics", "payments",
      "offline sync", "background processing", "performance tuning",
      "expo", "fastlane", "ci/cd", "analytics", "crash reporting"
    ],
    softSkills: [
      "ui/ux", "agile", "scrum", "problem solving",
      "cross-platform", "communication", "user testing"
    ]
  }
};

module.exports = skillsDataset;
