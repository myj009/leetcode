#include <iostream>
#include <vector>
using namespace std;

std::vector<int> sortArray(std::vector<int>& nums);

int main() {
    // Test case 1: Empty array
    vector<int> arr1 = {};
    std::vector<int> sortedArr1 = sortArray(arr1);
    string err = "\"Test case failed\"";

    // Test case 2: Array with one element
    std::vector<int> arr2 = {5};
    std::vector<int> ans2 = {5};
    std::vector<int> sortedArr2 = sortArray(arr2);
    for(int i=0;i<sortedArr2.size();i++){
        if(sortedArr2[i] != ans2[i]){
            cerr<<err<<endl;
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
    }

    // Test case 3: Array with multiple elements
    std::vector<int> arr3 = {3, 1, 4, 2};
    vector<int> ogArr3 = arr3;
    std::vector<int> ans3 = {1, 2, 3, 4};
    std::vector<int> sortedArr3 = sortArray(arr3);
    for(int i=0;i<sortedArr3.size();i++){
           
        if(sortedArr3[i] != ans3[i]){
            cerr<<err<<endl;
            cerr<<"\" - [\"";
            for(int i=0;i<ogArr3.size();i++){
                if(i!=0) {
                    cerr<<',';
                }
                cerr<<ogArr3[i];
            }
            cerr<<']'<<endl;
            return 1;
        }
    }

    return 0;
}