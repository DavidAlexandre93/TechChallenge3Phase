<!-- 
NÃO É MAIS NECESSÁRIO POR CONTA DO DOCKER
para rodar:
    terminal 1 (iniciar bff):
        cd backend-bff
        npm run dev

    terminal 2 (iniciar página react):
        cd frontend
        npm run dev -->

Docker (raiz do projeto):
    Build:
        docker compose up --build
    Reconstrução:
        docker compose down --volumes
        docker compose build --no-cache
        docker compose up


Healthcheck: http://localhost:4000/health
Posts API: http://localhost:4000/posts
Frontend: http://localhost:5173/


para logar:
    email: profx@professor.com
    senha: senh@

    ou

    email: jubileu@professor.com
    senha: s&nha