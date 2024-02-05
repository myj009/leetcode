#include <iostream>
#include <vector>
using namespace std;

int maxNumber(std::vector<int>& arr);

int main() {
  // Test case 1: Single digit array
  std::vector<int> arr1 = {5};
  int ans1 = 5;
  int max1 = maxNumber(arr1);
  if(max1 != ans1){
    cerr<<"\"Test case 1 failed\""<<endl;
    cerr<<"\" - [\"";
    for(int i=0;i<arr1.size();i++){
      if(i!=0) {
        cerr<<',';
      }
      cerr<<arr1[i];
    }
    cerr<<']'<<endl;
    return 1;
  }

  // Test case 2: Multiple digit array
  std::vector<int> arr2 = {3, 1, 4, 2};
  int ans2 = 4;
  int max2 = maxNumber(arr2);
  if(max2 != ans2){
    cerr<<"\"Test case 2 failed\""<<endl;
    cerr<<"\" - [\"";
    for(int i=0;i<arr2.size();i++){
      if(i!=0) {
        cerr<<',';
      }
      cerr<<arr2[i];
    }
    cerr<<']'<<endl;
    return 1;
  }

  // Test case 3: Array with negative numbers
  std::vector<int> arr3 = {-3, -1, -4, -2};
  int ans3 = -1;
  int max3 = maxNumber(arr3);
  if(max3 != ans3){
    cerr<<"\"Test case 3 failed\""<<endl;
    cerr<<"\" - [\"";
    for(int i=0;i<arr3.size();i++){
      if(i!=0) {
        cerr<<',';
      }
      cerr<<arr3[i];
    }
    cerr<<']'<<endl;
    return 1;
  }

  return 0;

}