class Chapter < ApplicationRecord
	has_one_attached :chapter_file, service: :s3
end
