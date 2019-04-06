class CommentsController < ApplicationController
  before_action :set_video
  before_action :set_comment, only: [:show, :update, :destroy]

  def index
    render json: Comment.all
  end

  def show
    render json: @comment
  end

  def create
    comment = Comment.new(comment_params)

    if comment.save
      render json: comment
    else
      render json: comment.errors, status: 422
    end
  end

  def update
    if @comment.update(comment_params)
      render json: @comment 
    else
      render json: @comment.errors, status: 422
  end

  def destroy
    @comment.destroy
  end

  private 
    def set_video
      @video = Video.find(@video[:id])
    end

    def set_comment
      @comment = Comment.find(params[:id])
    end

    def comment_params
      params.permit(:comment).require(:author, :body)
    end
end
