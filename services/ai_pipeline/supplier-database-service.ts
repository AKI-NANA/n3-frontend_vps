export class SupplierDatabaseService {
  static async searchSuppliers(query: any) {
    return { suppliers: [] };
  }
  
  static async getSupplierDetails(id: string) {
    return { id, name: 'Test Supplier', status: 'pending' };
  }
  
  static async approveSupplier(id: string) {
    return { success: true, id };
  }
}

export default SupplierDatabaseService;
