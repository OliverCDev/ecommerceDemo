import React from 'react';
import { Upload, Image, AlertCircle } from 'lucide-react';

const ProductImageUpload = ({ formData, errors, imagePreview, handleInputChange, handleImageError }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Image className="w-4 h-4 inline mr-2" />
          URL de Imagen
        </label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.imageUrl ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.imageUrl}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Proporciona una URL válida de imagen. Si no agregas una, se usará una imagen por defecto.
        </p>
      </div>

      {/* Image Preview */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Vista previa"
                className="w-full h-48 object-cover rounded-lg"
                onError={handleImageError}
              />
              <p className="text-sm text-green-600 font-medium">✓ Imagen cargada correctamente</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-600 font-medium">Vista previa de imagen</p>
                <p className="text-sm text-gray-500">
                  Agrega una URL válida para ver la vista previa
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Image Sources */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">💡 Fuentes de imágenes recomendadas:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Unsplash:</strong> unsplash.com (imágenes gratuitas)</li>
          <li>• <strong>Pexels:</strong> pexels.com (imágenes gratuitas)</li>
          <li>• <strong>Pixabay:</strong> pixabay.com (imágenes gratuitas)</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductImageUpload;