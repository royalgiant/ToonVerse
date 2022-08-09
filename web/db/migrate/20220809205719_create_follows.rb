class CreateFollows < ActiveRecord::Migration[7.0]
  def change
    create_table :follows do |t|
      t.integer :follower_id # The user giving the other user a follow
      t.integer :followed_user_id # The ID of the user who is being followed.

      t.timestamps
    end
  end
end
