#!/bin/bash

# PU分前端项目启动脚本

echo "🚀 启动 PU分 前端项目..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖包..."
    npm install
fi

# 启动开发服务器
echo "🌟 启动开发服务器..."
echo "📱 项目将在 http://localhost:3000 启动"
echo "🔗 确保后端服务器在 http://localhost:3001 运行"
echo ""

npm run dev