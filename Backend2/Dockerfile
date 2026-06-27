FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    nodejs \
    npm

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
# Added pdo_pgsql and pgsql for PostgreSQL support
RUN docker-php-ext-install pdo_mysql pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy custom Apache configuration
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# Copy existing application directory contents
COPY . .

# Install dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Change Apache Listen port to the PORT environment variable provided by Render
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

EXPOSE ${PORT:-80}

CMD ["apache2-foreground"]
