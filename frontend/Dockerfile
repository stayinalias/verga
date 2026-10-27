FROM nginx:alpine

# Copy static frontend files to Nginx web root
COPY . /usr/share/nginx/html

# Expose port 80 for Render
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
